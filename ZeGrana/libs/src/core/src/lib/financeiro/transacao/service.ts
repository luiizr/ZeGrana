import { ITransacaoProvider } from './provider';
import {
  CriarTransacaoDTO,
  CriarTransferenciaDTO,
  AtualizarTransacaoDTO,
  Transacao,
  FiltrosTransacaoDTO,
  ResumoGastos,
  TransacaoDivisao,
} from './model';
import { Validator, MoneyValidator, DateValidator } from '../shared/validators';
import { Pagination, DateRange } from '../types/common';
import { TipoTransacao, StatusTransacao } from '../types/enums';
import { addMoney, subtractMoney, createMoney, Money, moneyToNumber } from '../types/money';
import { IContaProvider } from '../conta/provider';

/**
 * Serviço de negócio para Transação
 */
export class TransacaoService {
  constructor(
    private readonly transacaoProvider: ITransacaoProvider,
    private readonly contaProvider: IContaProvider
  ) {}

  /**
   * Cria uma nova transação com validações
   */
  async criar(dados: CriarTransacaoDTO): Promise<Transacao> {
    // Validações básicas
    this.validarDadosTransacao(dados);

    // Valida que a conta existe
    const conta = await this.contaProvider.buscarPorId(dados.contaId);
    if (!conta) {
      throw new Error('Conta não encontrada');
    }

    // Valida divisões se houver
    if (dados.divisoes && dados.divisoes.length > 0) {
      this.validarDivisoes(dados.divisoes, dados.valor);
    }

    // Busca duplicatas potenciais
    const duplicatas = await this.transacaoProvider.buscarDuplicatas(dados);
    if (duplicatas.length > 0) {
      console.warn('Possível duplicata detectada', duplicatas);
      // Pode lançar erro ou apenas avisar
    }

    const status = dados.status || StatusTransacao.CONFIRMADA;
    const tags = dados.tags || [];

    const transacao = await this.transacaoProvider.criar({
      ...dados,
      status,
      tags,
    });

    // Atualiza o saldo da conta
    await this.atualizarSaldoConta(conta.id, transacao);

    return transacao;
  }

  /**
   * Cria uma transferência entre duas contas
   */
  async criarTransferencia(dados: CriarTransferenciaDTO): Promise<{ origem: Transacao; destino: Transacao }> {
    if (!Validator.isValidUUID(dados.usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    if (!Validator.isValidUUID(dados.contaOrigemId)) {
      throw new Error('ID de conta origem inválido');
    }

    if (!Validator.isValidUUID(dados.contaDestinoId)) {
      throw new Error('ID de conta destino inválido');
    }

    if (dados.contaOrigemId === dados.contaDestinoId) {
      throw new Error('Conta origem e destino não podem ser a mesma');
    }

    MoneyValidator.validateMoney(dados.valor.amount);
    if (!MoneyValidator.isPositive(dados.valor.amount)) {
      throw new Error('Valor da transferência deve ser positivo');
    }

    // Cria transação de saída
    const transacaoSaida: CriarTransacaoDTO = {
      usuarioId: dados.usuarioId,
      contaId: dados.contaOrigemId,
      tipo: TipoTransacao.TRANSFERENCIA,
      valor: dados.valor,
      data: dados.data,
      descricao: `Transferência para conta destino - ${dados.descricao}`,
      tags: dados.tags || ['transferencia'],
      observacoes: dados.observacoes,
      status: StatusTransacao.CONFIRMADA,
    };

    // Cria transação de entrada
    const transacaoEntrada: CriarTransacaoDTO = {
      usuarioId: dados.usuarioId,
      contaId: dados.contaDestinoId,
      tipo: TipoTransacao.TRANSFERENCIA,
      valor: dados.valor,
      data: dados.data,
      descricao: `Transferência de conta origem - ${dados.descricao}`,
      tags: dados.tags || ['transferencia'],
      observacoes: dados.observacoes,
      status: StatusTransacao.CONFIRMADA,
    };

    const [saida, entrada] = await this.transacaoProvider.criarEmLote([transacaoSaida, transacaoEntrada]);

    // Vincula as transações
    await this.transacaoProvider.atualizar(saida.id, { transacaoRelacionadaId: entrada.id });
    await this.transacaoProvider.atualizar(entrada.id, { transacaoRelacionadaId: saida.id });

    // Atualiza saldos
    await this.atualizarSaldoContaTransferencia(dados.contaOrigemId, dados.contaDestinoId, dados.valor);

    return { origem: saida, destino: entrada };
  }

  /**
   * Busca uma transação por ID
   */
  async buscarPorId(id: string): Promise<Transacao> {
    if (!Validator.isValidUUID(id)) {
      throw new Error('ID de transação inválido');
    }

    const transacao = await this.transacaoProvider.buscarPorId(id);
    if (!transacao) {
      throw new Error('Transação não encontrada');
    }

    return transacao;
  }

  /**
   * Lista transações do usuário com filtros
   */
  async listar(
    filtros: FiltrosTransacaoDTO,
    pagination: Pagination = { page: 1, limit: 50 }
  ) {
    if (!Validator.isValidUUID(filtros.usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    return this.transacaoProvider.listar(filtros, pagination);
  }

  /**
   * Atualiza uma transação
   */
  async atualizar(id: string, dados: AtualizarTransacaoDTO): Promise<Transacao> {
    const transacaoAtual = await this.buscarPorId(id);

    if (dados.valor) {
      MoneyValidator.validateMoney(dados.valor.amount, true);
    }

    if (dados.data && !DateValidator.isValidDate(dados.data)) {
      throw new Error('Data inválida');
    }

    if (dados.divisoes && dados.divisoes.length > 0) {
      const valorFinal = dados.valor || transacaoAtual.valor;
      this.validarDivisoes(dados.divisoes, valorFinal);
    }

    const transacaoAtualizada = await this.transacaoProvider.atualizar(id, dados);

    // Se o valor mudou, recalcula o saldo
    if (dados.valor && dados.valor.amount !== transacaoAtual.valor.amount) {
      await this.recalcularSaldoConta(transacaoAtual.contaId);
    }

    return transacaoAtualizada;
  }

  /**
   * Remove uma transação
   */
  async remover(id: string): Promise<void> {
    const transacao = await this.buscarPorId(id);

    // Se for transferência, remove ambas as transações
    if (transacao.tipo === TipoTransacao.TRANSFERENCIA && transacao.transacaoRelacionadaId) {
      await this.transacaoProvider.removerEmLote([id, transacao.transacaoRelacionadaId]);
      
      // Recalcula saldos de ambas as contas
      await this.recalcularSaldoConta(transacao.contaId);
      const relacionada = await this.transacaoProvider.buscarPorId(transacao.transacaoRelacionadaId);
      if (relacionada) {
        await this.recalcularSaldoConta(relacionada.contaId);
      }
    } else {
      await this.transacaoProvider.remover(id);
      await this.recalcularSaldoConta(transacao.contaId);
    }
  }

  /**
   * Gera resumo de gastos do usuário em um período
   */
  async gerarResumo(usuarioId: string, periodo: DateRange, contaIds?: string[]): Promise<ResumoGastos> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    if (!DateValidator.isValidDate(periodo.inicio) || !DateValidator.isValidDate(periodo.fim)) {
      throw new Error('Período inválido');
    }

    return this.transacaoProvider.gerarResumoGastos(usuarioId, periodo, contaIds);
  }

  /**
   * Lista transações pendentes do usuário
   */
  async listarPendentes(usuarioId: string): Promise<Transacao[]> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    return this.transacaoProvider.buscarPendentes(usuarioId);
  }

  /**
   * Confirma uma transação pendente
   */
  async confirmar(id: string): Promise<Transacao> {
    return this.atualizar(id, { status: StatusTransacao.CONFIRMADA });
  }

  /**
   * Reconcilia uma transação
   */
  async reconciliar(id: string): Promise<Transacao> {
    await this.buscarPorId(id);
    return this.transacaoProvider.reconciliar(id);
  }

  /**
   * Cancela uma transação
   */
  async cancelar(id: string): Promise<Transacao> {
    const transacao = await this.buscarPorId(id);
    
    if (transacao.status === StatusTransacao.CANCELADA) {
      throw new Error('Transação já está cancelada');
    }

    const cancelada = await this.atualizar(id, { status: StatusTransacao.CANCELADA });
    
    // Recalcula saldo
    await this.recalcularSaldoConta(transacao.contaId);
    
    return cancelada;
  }

  // ===== Métodos privados auxiliares =====

  private validarDadosTransacao(dados: CriarTransacaoDTO): void {
    if (!Validator.isValidUUID(dados.usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    if (!Validator.isValidUUID(dados.contaId)) {
      throw new Error('ID de conta inválido');
    }

    if (!Validator.isNotEmpty(dados.descricao)) {
      throw new Error('Descrição é obrigatória');
    }

    MoneyValidator.validateMoney(dados.valor.amount, true);

    if (!DateValidator.isValidDate(dados.data)) {
      throw new Error('Data inválida');
    }

    if (dados.categoriaId && !Validator.isValidUUID(dados.categoriaId)) {
      throw new Error('ID de categoria inválido');
    }

    if (dados.cartaoId && !Validator.isValidUUID(dados.cartaoId)) {
      throw new Error('ID de cartão inválido');
    }
  }

  private validarDivisoes(divisoes: Omit<TransacaoDivisao, 'id'>[], valorTotal: Money): void {
    if (divisoes.length === 0) {
      throw new Error('Divisões não podem estar vazias');
    }

    // Soma os valores das divisões
    let somaValores = 0;
    for (const divisao of divisoes) {
      MoneyValidator.validateMoney(divisao.valor.amount);
      
      if (divisao.valor.currency !== valorTotal.currency) {
        throw new Error('Todas as divisões devem usar a mesma moeda da transação');
      }
      
      somaValores += moneyToNumber(divisao.valor);
    }

    const totalEsperado = moneyToNumber(valorTotal);
    
    // Permite uma diferença de 0.01 por arredondamento
    if (Math.abs(somaValores - totalEsperado) > 0.01) {
      throw new Error(
        `A soma das divisões (${somaValores.toFixed(2)}) não corresponde ao valor total (${totalEsperado.toFixed(2)})`
      );
    }
  }

  private async atualizarSaldoConta(contaId: string, transacao: Transacao): Promise<void> {
    const conta = await this.contaProvider.buscarPorId(contaId);
    if (!conta) return;

    let novoSaldo = conta.saldo;
    const valor = transacao.valor;

    // Aplica o valor conforme o tipo e status
    if (transacao.status !== StatusTransacao.CANCELADA) {
      if (transacao.tipo === TipoTransacao.RECEITA) {
        novoSaldo = addMoney(conta.saldo, valor);
      } else if (transacao.tipo === TipoTransacao.DESPESA) {
        novoSaldo = subtractMoney(conta.saldo, valor);
      }
      // TRANSFERENCIA é tratada separadamente
    }

    await this.contaProvider.atualizarSaldo(contaId, novoSaldo);
  }

  private async atualizarSaldoContaTransferencia(
    contaOrigemId: string,
    contaDestinoId: string,
    valor: Money
  ): Promise<void> {
    const [origem, destino] = await Promise.all([
      this.contaProvider.buscarPorId(contaOrigemId),
      this.contaProvider.buscarPorId(contaDestinoId),
    ]);

    if (!origem || !destino) return;

    const novoSaldoOrigem = subtractMoney(origem.saldo, valor);
    const novoSaldoDestino = addMoney(destino.saldo, valor);

    await Promise.all([
      this.contaProvider.atualizarSaldo(contaOrigemId, novoSaldoOrigem),
      this.contaProvider.atualizarSaldo(contaDestinoId, novoSaldoDestino),
    ]);
  }

  private async recalcularSaldoConta(contaId: string): Promise<void> {
    // Busca todas as transações confirmadas da conta
    const transacoes = await this.transacaoProvider.listar(
      {
        usuarioId: '', // será filtrado no provider
        contaIds: [contaId],
        status: [StatusTransacao.CONFIRMADA, StatusTransacao.RECONCILIADA],
      },
      { page: 1, limit: 10000 } // limite alto para pegar tudo
    );

    const conta = await this.contaProvider.buscarPorId(contaId);
    if (!conta) return;

    // Calcula o saldo somando todas as transações
    let saldo = createMoney('0.00', conta.moeda);

    for (const transacao of transacoes.data) {
      if (transacao.tipo === TipoTransacao.RECEITA) {
        saldo = addMoney(saldo, transacao.valor);
      } else if (transacao.tipo === TipoTransacao.DESPESA) {
        saldo = subtractMoney(saldo, transacao.valor);
      }
      // Transferências já afetam o saldo através de receita/despesa nas respectivas contas
    }

    await this.contaProvider.atualizarSaldo(contaId, saldo);
  }
}
