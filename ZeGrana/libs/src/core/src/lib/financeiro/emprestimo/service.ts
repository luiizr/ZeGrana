import { IEmprestimoProvider } from './provider';
import {
  CriarEmprestimoDTO,
  AtualizarEmprestimoDTO,
  Emprestimo,
  Parcela,
  PagarParcelaDTO,
  CronogramaAmortizacao,
} from './model';
import { Validator, MoneyValidator } from '../shared/validators';
import { TipoAmortizacao, StatusParcela, TipoTransacao, StatusTransacao } from '../types/enums';
import { createMoney, moneyToNumber } from '../types/money';
import { ITransacaoProvider } from '../transacao/provider';

/**
 * Serviço de negócio para Empréstimo
 */
export class EmprestimoService {
  constructor(
    private readonly emprestimoProvider: IEmprestimoProvider,
    private readonly transacaoProvider: ITransacaoProvider
  ) {}

  /**
   * Cria um novo empréstimo com validações e geração do cronograma
   */
  async criar(dados: CriarEmprestimoDTO): Promise<Emprestimo> {
    // Validações
    if (!Validator.isValidUUID(dados.usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    if (!Validator.isNotEmpty(dados.nome)) {
      throw new Error('Nome do empréstimo é obrigatório');
    }

    MoneyValidator.validateMoney(dados.valorPrincipal.amount);
    if (!MoneyValidator.isPositive(dados.valorPrincipal.amount)) {
      throw new Error('Valor principal deve ser positivo');
    }

    if (dados.taxaJurosAnual < 0 || dados.taxaJurosAnual > 100) {
      throw new Error('Taxa de juros deve estar entre 0 e 100');
    }

    if (dados.prazoMeses < 1) {
      throw new Error('Prazo deve ser de pelo menos 1 mês');
    }

    // Gera o cronograma de amortização
    const cronograma = this.gerarCronograma(dados);

    // Cria as parcelas
    const parcelas: Omit<Parcela, 'id' | 'createdAt' | 'updatedAt' | 'emprestimoId'>[] = cronograma.parcelas.map(
      (p) => ({
        numero: p.numero,
        dataVencimento: p.dataVencimento,
        valor: p.valorParcela,
        valorPrincipal: p.valorPrincipal,
        valorJuros: p.valorJuros,
        status: StatusParcela.ABERTA,
      })
    );

    return this.emprestimoProvider.criar(dados, parcelas as Parcela[]);
  }

  /**
   * Busca um empréstimo por ID
   */
  async buscarPorId(id: string): Promise<Emprestimo> {
    if (!Validator.isValidUUID(id)) {
      throw new Error('ID de empréstimo inválido');
    }

    const emprestimo = await this.emprestimoProvider.buscarPorId(id);
    if (!emprestimo) {
      throw new Error('Empréstimo não encontrado');
    }

    return emprestimo;
  }

  /**
   * Lista empréstimos do usuário
   */
  async listarPorUsuario(usuarioId: string, apenasAtivos = true): Promise<Emprestimo[]> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    return this.emprestimoProvider.listarPorUsuario(usuarioId, apenasAtivos);
  }

  /**
   * Atualiza um empréstimo
   */
  async atualizar(id: string, dados: AtualizarEmprestimoDTO): Promise<Emprestimo> {
    await this.buscarPorId(id);

    if (dados.nome !== undefined && !Validator.isNotEmpty(dados.nome)) {
      throw new Error('Nome do empréstimo não pode ser vazio');
    }

    return this.emprestimoProvider.atualizar(id, dados);
  }

  /**
   * Encerra um empréstimo (marca como inativo)
   */
  async encerrar(id: string): Promise<Emprestimo> {
    return this.atualizar(id, { ativo: false });
  }

  /**
   * Remove um empréstimo
   */
  async remover(id: string): Promise<void> {
    await this.buscarPorId(id);
    return this.emprestimoProvider.remover(id);
  }

  /**
   * Paga uma parcela e cria a transação correspondente
   */
  async pagarParcela(dados: PagarParcelaDTO): Promise<{ parcela: Parcela; transacaoId: string }> {
    if (!Validator.isValidUUID(dados.parcelaId)) {
      throw new Error('ID de parcela inválido');
    }

    if (!Validator.isValidUUID(dados.contaId)) {
      throw new Error('ID de conta inválido');
    }

    MoneyValidator.validateMoney(dados.valorPago.amount);
    if (!MoneyValidator.isPositive(dados.valorPago.amount)) {
      throw new Error('Valor pago deve ser positivo');
    }

    const parcela = await this.emprestimoProvider.buscarParcelaPorId(dados.parcelaId);
    if (!parcela) {
      throw new Error('Parcela não encontrada');
    }

    if (parcela.status === StatusParcela.PAGA) {
      throw new Error('Parcela já está paga');
    }

    // Busca o empréstimo para pegar o usuarioId
    const emprestimo = await this.emprestimoProvider.buscarPorId(parcela.emprestimoId);
    if (!emprestimo) {
      throw new Error('Empréstimo não encontrado');
    }

    // Cria a transação de pagamento
    const transacao = await this.transacaoProvider.criar({
      usuarioId: emprestimo.usuarioId,
      contaId: dados.contaId,
      tipo: TipoTransacao.DESPESA,
      valor: dados.valorPago,
      data: dados.dataPagamento,
      descricao: `Pagamento parcela ${parcela.numero} - ${emprestimo.nome}`,
      status: StatusTransacao.CONFIRMADA,
      tags: ['emprestimo', 'parcela'],
    });

    // Registra o pagamento da parcela
    const parcelaPaga = await this.emprestimoProvider.pagarParcela({
      ...dados,
      parcelaId: parcela.id,
    });

    // Atualiza o saldo devedor
    await this.emprestimoProvider.atualizarSaldoDevedor(emprestimo.id);

    return { parcela: parcelaPaga, transacaoId: transacao.id };
  }

  /**
   * Busca parcelas vencidas
   */
  async buscarParcelasVencidas(usuarioId: string): Promise<Parcela[]> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    return this.emprestimoProvider.buscarParcelasVencidas(usuarioId);
  }

  /**
   * Busca próximas parcelas a vencer nos próximos N dias
   */
  async buscarProximasParcelas(usuarioId: string, dias = 30): Promise<Parcela[]> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    if (dias < 1) {
      throw new Error('Número de dias deve ser positivo');
    }

    return this.emprestimoProvider.buscarProximasParcelas(usuarioId, dias);
  }

  /**
   * Gera o cronograma de amortização
   */
  gerarCronograma(dados: CriarEmprestimoDTO): CronogramaAmortizacao {
    const principal = moneyToNumber(dados.valorPrincipal);
    const taxaMensal = dados.taxaJurosAnual / 12 / 100; // Converte taxa anual para mensal decimal
    const prazo = dados.prazoMeses;
    const moeda = dados.valorPrincipal.currency;

    const parcelas: CronogramaAmortizacao['parcelas'] = [];
    let saldoDevedor = principal;
    let totalJuros = 0;

    if (dados.tipoAmortizacao === TipoAmortizacao.PRICE) {
      // Sistema PRICE: parcelas fixas
      // PMT = P * (i * (1+i)^n) / ((1+i)^n - 1)
      const pmt =
        taxaMensal > 0
          ? (principal * (taxaMensal * Math.pow(1 + taxaMensal, prazo))) /
            (Math.pow(1 + taxaMensal, prazo) - 1)
          : principal / prazo;

      for (let i = 1; i <= prazo; i++) {
        const juros = saldoDevedor * taxaMensal;
        const amortizacao = pmt - juros;

        saldoDevedor -= amortizacao;
        totalJuros += juros;

        const dataVencimento = new Date(dados.dataInicio);
        dataVencimento.setMonth(dataVencimento.getMonth() + i);

        parcelas.push({
          numero: i,
          dataVencimento,
          valorParcela: createMoney(pmt.toFixed(2), moeda),
          valorPrincipal: createMoney(amortizacao.toFixed(2), moeda),
          valorJuros: createMoney(juros.toFixed(2), moeda),
          saldoDevedor: createMoney(Math.max(0, saldoDevedor).toFixed(2), moeda),
        });
      }
    } else if (dados.tipoAmortizacao === TipoAmortizacao.SAC) {
      // Sistema SAC: amortização constante
      const amortizacao = principal / prazo;

      for (let i = 1; i <= prazo; i++) {
        const juros = saldoDevedor * taxaMensal;
        const pmt = amortizacao + juros;

        saldoDevedor -= amortizacao;
        totalJuros += juros;

        const dataVencimento = new Date(dados.dataInicio);
        dataVencimento.setMonth(dataVencimento.getMonth() + i);

        parcelas.push({
          numero: i,
          dataVencimento,
          valorParcela: createMoney(pmt.toFixed(2), moeda),
          valorPrincipal: createMoney(amortizacao.toFixed(2), moeda),
          valorJuros: createMoney(juros.toFixed(2), moeda),
          saldoDevedor: createMoney(Math.max(0, saldoDevedor).toFixed(2), moeda),
        });
      }
    } else {
      throw new Error('Tipo de amortização não suportado');
    }

    const valorTotal = principal + totalJuros;

    return {
      parcelas,
      valorTotal: createMoney(valorTotal.toFixed(2), moeda),
      totalJuros: createMoney(totalJuros.toFixed(2), moeda),
    };
  }

  /**
   * Simula um empréstimo (gera cronograma sem salvar)
   */
  simular(dados: CriarEmprestimoDTO): CronogramaAmortizacao {
    return this.gerarCronograma(dados);
  }
}
