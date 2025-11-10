import { IOrcamentoProvider } from './provider';
import { CriarOrcamentoDTO, AtualizarOrcamentoDTO, Orcamento, HistoricoOrcamento, ResumoOrcamentos } from './model';
import { Validator, MoneyValidator } from '../shared/validators';
import { Periodo } from '../types/enums';

/**
 * Serviço de negócio para Orçamento
 */
export class OrcamentoService {
  constructor(private readonly orcamentoProvider: IOrcamentoProvider) {}

  /**
   * Cria um novo orçamento com validações
   */
  async criar(dados: CriarOrcamentoDTO): Promise<Orcamento> {
    // Validações
    if (!Validator.isValidUUID(dados.usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    if (!Validator.isValidUUID(dados.categoriaId)) {
      throw new Error('ID de categoria inválido');
    }

    if (!Validator.isNotEmpty(dados.nome)) {
      throw new Error('Nome do orçamento é obrigatório');
    }

    MoneyValidator.validateMoney(dados.valorPlanejado.amount);
    if (!MoneyValidator.isPositive(dados.valorPlanejado.amount)) {
      throw new Error('Valor planejado deve ser positivo');
    }

    if (dados.percentualAlerta !== undefined) {
      if (!Validator.isInRange(dados.percentualAlerta, 1, 100)) {
        throw new Error('Percentual de alerta deve estar entre 1 e 100');
      }
    }

    // Verifica se já existe orçamento para esta categoria
    const orcamentoExistente = await this.orcamentoProvider.buscarPorCategoria(dados.categoriaId);
    if (orcamentoExistente) {
      throw new Error('Já existe um orçamento para esta categoria');
    }

    return this.orcamentoProvider.criar(dados);
  }

  /**
   * Busca um orçamento por ID
   */
  async buscarPorId(id: string): Promise<Orcamento> {
    if (!Validator.isValidUUID(id)) {
      throw new Error('ID de orçamento inválido');
    }

    const orcamento = await this.orcamentoProvider.buscarPorId(id);
    if (!orcamento) {
      throw new Error('Orçamento não encontrado');
    }

    return orcamento;
  }

  /**
   * Lista orçamentos do usuário
   */
  async listarPorUsuario(usuarioId: string, apenasAtivos = true): Promise<Orcamento[]> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    return this.orcamentoProvider.listarPorUsuario(usuarioId, apenasAtivos);
  }

  /**
   * Atualiza um orçamento
   */
  async atualizar(id: string, dados: AtualizarOrcamentoDTO): Promise<Orcamento> {
    await this.buscarPorId(id);

    if (dados.nome !== undefined && !Validator.isNotEmpty(dados.nome)) {
      throw new Error('Nome do orçamento não pode ser vazio');
    }

    if (dados.valorPlanejado) {
      MoneyValidator.validateMoney(dados.valorPlanejado.amount);
      if (!MoneyValidator.isPositive(dados.valorPlanejado.amount)) {
        throw new Error('Valor planejado deve ser positivo');
      }
    }

    if (dados.percentualAlerta !== undefined && !Validator.isInRange(dados.percentualAlerta, 1, 100)) {
      throw new Error('Percentual de alerta deve estar entre 1 e 100');
    }

    return this.orcamentoProvider.atualizar(id, dados);
  }

  /**
   * Desativa um orçamento
   */
  async desativar(id: string): Promise<Orcamento> {
    return this.atualizar(id, { ativo: false });
  }

  /**
   * Ativa um orçamento
   */
  async ativar(id: string): Promise<Orcamento> {
    return this.atualizar(id, { ativo: true });
  }

  /**
   * Remove um orçamento
   */
  async remover(id: string): Promise<void> {
    await this.buscarPorId(id);
    return this.orcamentoProvider.remover(id);
  }

  /**
   * Atualiza o valor gasto (recalcula com base nas transações)
   */
  async atualizarValorGasto(id: string): Promise<Orcamento> {
    await this.buscarPorId(id);
    return this.orcamentoProvider.atualizarValorGasto(id);
  }

  /**
   * Busca orçamentos em alerta (próximos do limite)
   */
  async buscarEmAlerta(usuarioId: string): Promise<Orcamento[]> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    return this.orcamentoProvider.buscarEmAlerta(usuarioId);
  }

  /**
   * Busca orçamentos estourados (valor gasto > valor planejado)
   */
  async buscarEstourados(usuarioId: string): Promise<Orcamento[]> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    return this.orcamentoProvider.buscarEstourados(usuarioId);
  }

  /**
   * Gera resumo de todos os orçamentos do usuário
   */
  async gerarResumo(usuarioId: string): Promise<ResumoOrcamentos> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    return this.orcamentoProvider.gerarResumo(usuarioId);
  }

  /**
   * Busca histórico de um orçamento
   */
  async buscarHistorico(orcamentoId: string, limite = 12): Promise<HistoricoOrcamento[]> {
    if (!Validator.isValidUUID(orcamentoId)) {
      throw new Error('ID de orçamento inválido');
    }

    await this.buscarPorId(orcamentoId);

    return this.orcamentoProvider.buscarHistorico(orcamentoId, limite);
  }

  /**
   * Renova o período do orçamento (fecha período atual e cria novo)
   */
  async renovarPeriodo(id: string): Promise<Orcamento> {
    await this.buscarPorId(id);
    return this.orcamentoProvider.renovarPeriodo(id);
  }

  /**
   * Calcula se o orçamento está em alerta
   */
  estaEmAlerta(orcamento: Orcamento): boolean {
    if (!orcamento.alertar || !orcamento.percentualAlerta) {
      return false;
    }

    return orcamento.percentualUtilizado >= orcamento.percentualAlerta;
  }

  /**
   * Calcula se o orçamento foi estourado
   */
  estaEstourado(orcamento: Orcamento): boolean {
    return orcamento.percentualUtilizado > 100;
  }

  /**
   * Calcula o período seguinte baseado no tipo de período
   */
  calcularProximoPeriodo(inicioPeriodoAtual: Date, periodo: Periodo): { inicio: Date; fim: Date } {
    const inicio = new Date(inicioPeriodoAtual);
    const fim = new Date(inicioPeriodoAtual);

    switch (periodo) {
      case Periodo.SEMANAL:
        inicio.setDate(inicio.getDate() + 7);
        fim.setDate(fim.getDate() + 14);
        fim.setDate(fim.getDate() - 1);
        break;

      case Periodo.MENSAL:
        inicio.setMonth(inicio.getMonth() + 1);
        fim.setMonth(fim.getMonth() + 2);
        fim.setDate(0); // último dia do mês
        break;

      case Periodo.TRIMESTRAL:
        inicio.setMonth(inicio.getMonth() + 3);
        fim.setMonth(fim.getMonth() + 6);
        fim.setDate(0);
        break;

      case Periodo.SEMESTRAL:
        inicio.setMonth(inicio.getMonth() + 6);
        fim.setMonth(fim.getMonth() + 12);
        fim.setDate(0);
        break;

      case Periodo.ANUAL:
        inicio.setFullYear(inicio.getFullYear() + 1);
        fim.setFullYear(fim.getFullYear() + 2);
        fim.setDate(0);
        break;

      default:
        throw new Error('Período inválido');
    }

    return { inicio, fim };
  }
}
