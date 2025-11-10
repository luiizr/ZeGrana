import { Orcamento, CriarOrcamentoDTO, AtualizarOrcamentoDTO, HistoricoOrcamento, ResumoOrcamentos } from './model';

/**
 * Interface do provider (repositório) de Orçamento
 */
export interface IOrcamentoProvider {
  /**
   * Cria um novo orçamento
   */
  criar(dados: CriarOrcamentoDTO): Promise<Orcamento>;

  /**
   * Busca um orçamento por ID
   */
  buscarPorId(id: string): Promise<Orcamento | null>;

  /**
   * Lista orçamentos do usuário
   */
  listarPorUsuario(usuarioId: string, apenasAtivos?: boolean): Promise<Orcamento[]>;

  /**
   * Busca orçamento por categoria
   */
  buscarPorCategoria(categoriaId: string): Promise<Orcamento | null>;

  /**
   * Atualiza um orçamento
   */
  atualizar(id: string, dados: AtualizarOrcamentoDTO): Promise<Orcamento>;

  /**
   * Remove um orçamento
   */
  remover(id: string): Promise<void>;

  /**
   * Atualiza o valor gasto do orçamento
   */
  atualizarValorGasto(id: string): Promise<Orcamento>;

  /**
   * Busca orçamentos em alerta (próximos do limite)
   */
  buscarEmAlerta(usuarioId: string): Promise<Orcamento[]>;

  /**
   * Busca orçamentos estourados
   */
  buscarEstourados(usuarioId: string): Promise<Orcamento[]>;

  /**
   * Gera resumo de orçamentos do usuário
   */
  gerarResumo(usuarioId: string): Promise<ResumoOrcamentos>;

  /**
   * Busca histórico de um orçamento
   */
  buscarHistorico(orcamentoId: string, limite?: number): Promise<HistoricoOrcamento[]>;

  /**
   * Renova período do orçamento (avança para próximo período)
   */
  renovarPeriodo(id: string): Promise<Orcamento>;
}
