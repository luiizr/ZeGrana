import {
  Transacao,
  CriarTransacaoDTO,
  CriarTransferenciaDTO,
  AtualizarTransacaoDTO,
  FiltrosTransacaoDTO,
  ResumoGastos,
} from './model';
import { PaginatedResponse, Pagination, DateRange } from '../types/common';
import { Money } from '../types/money';

/**
 * Interface do provider (repositório) de Transação
 */
export interface ITransacaoProvider {
  /**
   * Cria uma nova transação
   */
  criar(dados: CriarTransacaoDTO): Promise<Transacao>;

  /**
   * Cria múltiplas transações (usado para transferências)
   */
  criarEmLote(transacoes: CriarTransacaoDTO[]): Promise<Transacao[]>;

  /**
   * Busca uma transação por ID
   */
  buscarPorId(id: string): Promise<Transacao | null>;

  /**
   * Lista transações com filtros e paginação
   */
  listar(filtros: FiltrosTransacaoDTO, pagination: Pagination): Promise<PaginatedResponse<Transacao>>;

  /**
   * Atualiza uma transação
   */
  atualizar(id: string, dados: AtualizarTransacaoDTO): Promise<Transacao>;

  /**
   * Remove uma transação
   */
  remover(id: string): Promise<void>;

  /**
   * Remove múltiplas transações (usado para remover transferências)
   */
  removerEmLote(ids: string[]): Promise<void>;

  /**
   * Calcula o total de transações por tipo em um período
   */
  calcularTotalPorTipo(
    usuarioId: string,
    periodo: DateRange,
    contaIds?: string[]
  ): Promise<{ receitas: Money; despesas: Money; saldo: Money }>;

  /**
   * Gera resumo de gastos por categoria
   */
  gerarResumoGastos(usuarioId: string, periodo: DateRange, contaIds?: string[]): Promise<ResumoGastos>;

  /**
   * Busca transações de uma categoria específica
   */
  buscarPorCategoria(categoriaId: string, periodo?: DateRange): Promise<Transacao[]>;

  /**
   * Busca transações pendentes
   */
  buscarPendentes(usuarioId: string): Promise<Transacao[]>;

  /**
   * Marca transação como reconciliada
   */
  reconciliar(id: string): Promise<Transacao>;

  /**
   * Busca duplicatas potenciais (mesma conta, valor próximo, data próxima)
   */
  buscarDuplicatas(transacao: CriarTransacaoDTO): Promise<Transacao[]>;
}
