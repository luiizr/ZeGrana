import { IContaProvider } from './provider';
import { CriarContaDTO, AtualizarContaDTO, Conta, FiltrosContaDTO } from './model';
import { Validator, MoneyValidator } from '../shared/validators';
import { createMoney, Money } from '../types/money';

/**
 * Serviço de negócio para Conta
 */
export class ContaService {
  constructor(private readonly contaProvider: IContaProvider) {}

  /**
   * Cria uma nova conta com validações
   */
  async criar(dados: CriarContaDTO): Promise<Conta> {
    // Validações
    if (!Validator.isValidUUID(dados.usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    if (!Validator.isNotEmpty(dados.nome)) {
      throw new Error('Nome da conta é obrigatório');
    }

    if (dados.bancoId && !Validator.isValidUUID(dados.bancoId)) {
      throw new Error('ID de banco inválido');
    }

    const moeda = dados.moeda || 'BRL';
    const saldoInicial = dados.saldoInicial || createMoney('0.00', moeda);

    // Valida o saldo inicial
    MoneyValidator.validateMoney(saldoInicial.amount, true);

    return this.contaProvider.criar({
      ...dados,
      moeda,
      saldoInicial,
    });
  }

  /**
   * Busca uma conta por ID
   */
  async buscarPorId(id: string): Promise<Conta> {
    if (!Validator.isValidUUID(id)) {
      throw new Error('ID de conta inválido');
    }

    const conta = await this.contaProvider.buscarPorId(id);
    if (!conta) {
      throw new Error('Conta não encontrada');
    }

    return conta;
  }

  /**
   * Lista contas do usuário
   */
  async listarPorUsuario(usuarioId: string, apenasAtivas = true): Promise<Conta[]> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    const filtros: FiltrosContaDTO = {
      usuarioId,
      ativa: apenasAtivas ? true : undefined,
    };

    return this.contaProvider.listar(filtros);
  }

  /**
   * Atualiza uma conta
   */
  async atualizar(id: string, dados: AtualizarContaDTO): Promise<Conta> {
    await this.buscarPorId(id); // Verifica se existe

    if (dados.nome !== undefined && !Validator.isNotEmpty(dados.nome)) {
      throw new Error('Nome da conta não pode ser vazio');
    }

    if (dados.bancoId && !Validator.isValidUUID(dados.bancoId)) {
      throw new Error('ID de banco inválido');
    }

    return this.contaProvider.atualizar(id, dados);
  }

  /**
   * Desativa uma conta (soft delete)
   */
  async desativar(id: string): Promise<Conta> {
    return this.atualizar(id, { ativa: false });
  }

  /**
   * Ativa uma conta
   */
  async ativar(id: string): Promise<Conta> {
    return this.atualizar(id, { ativa: true });
  }

  /**
   * Remove uma conta permanentemente
   */
  async remover(id: string): Promise<void> {
    await this.buscarPorId(id); // Verifica se existe
    return this.contaProvider.remover(id);
  }

  /**
   * Calcula o patrimônio total do usuário
   */
  async calcularPatrimonio(usuarioId: string): Promise<Money> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    return this.contaProvider.calcularPatrimonioTotal(usuarioId);
  }

  /**
   * Ajusta manualmente o saldo de uma conta
   * (use com cuidado - normalmente o saldo é atualizado via transações)
   */
  async ajustarSaldo(id: string, novoSaldo: Money): Promise<Conta> {
    await this.buscarPorId(id);
    MoneyValidator.validateMoney(novoSaldo.amount, true);
    
    return this.contaProvider.atualizarSaldo(id, novoSaldo);
  }
}
