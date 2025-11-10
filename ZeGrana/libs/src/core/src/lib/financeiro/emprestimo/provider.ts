import { Emprestimo, Parcela, CriarEmprestimoDTO, AtualizarEmprestimoDTO, PagarParcelaDTO } from './model';

/**
 * Interface do provider (repositório) de Empréstimo
 */
export interface IEmprestimoProvider {
  /**
   * Cria um novo empréstimo
   */
  criar(dados: CriarEmprestimoDTO, parcelas: Parcela[]): Promise<Emprestimo>;

  /**
   * Busca um empréstimo por ID
   */
  buscarPorId(id: string): Promise<Emprestimo | null>;

  /**
   * Lista empréstimos do usuário
   */
  listarPorUsuario(usuarioId: string, apenasAtivos?: boolean): Promise<Emprestimo[]>;

  /**
   * Atualiza um empréstimo
   */
  atualizar(id: string, dados: AtualizarEmprestimoDTO): Promise<Emprestimo>;

  /**
   * Remove um empréstimo
   */
  remover(id: string): Promise<void>;

  /**
   * Busca uma parcela por ID
   */
  buscarParcelaPorId(id: string): Promise<Parcela | null>;

  /**
   * Registra pagamento de uma parcela
   */
  pagarParcela(dados: PagarParcelaDTO): Promise<Parcela>;

  /**
   * Busca parcelas vencidas do usuário
   */
  buscarParcelasVencidas(usuarioId: string): Promise<Parcela[]>;

  /**
   * Busca próximas parcelas a vencer
   */
  buscarProximasParcelas(usuarioId: string, dias: number): Promise<Parcela[]>;

  /**
   * Atualiza saldo devedor do empréstimo
   */
  atualizarSaldoDevedor(emprestimoId: string): Promise<Emprestimo>;
}
