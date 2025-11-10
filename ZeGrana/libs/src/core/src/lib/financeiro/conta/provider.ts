import { Conta, CriarContaDTO, AtualizarContaDTO, FiltrosContaDTO } from './model';
import { Money } from '../types/money';

/**
 * Interface do provider (repositório) de Conta
 */
export interface IContaProvider {
  /**
   * Cria uma nova conta
   */
  criar(dados: CriarContaDTO): Promise<Conta>;

  /**
   * Busca uma conta por ID
   */
  buscarPorId(id: string): Promise<Conta | null>;

  /**
   * Lista contas com filtros
   */
  listar(filtros: FiltrosContaDTO): Promise<Conta[]>;

  /**
   * Atualiza uma conta
   */
  atualizar(id: string, dados: AtualizarContaDTO): Promise<Conta>;

  /**
   * Remove uma conta
   */
  remover(id: string): Promise<void>;

  /**
   * Atualiza o saldo de uma conta
   */
  atualizarSaldo(id: string, novoSaldo: Money): Promise<Conta>;

  /**
   * Busca contas ativas do usuário
   */
  buscarAtivasPorUsuario(usuarioId: string): Promise<Conta[]>;

  /**
   * Calcula o patrimônio total do usuário (soma de todos os saldos)
   */
  calcularPatrimonioTotal(usuarioId: string): Promise<Money>;
}
