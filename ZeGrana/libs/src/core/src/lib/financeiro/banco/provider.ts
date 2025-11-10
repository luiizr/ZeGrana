import { Banco, CriarBancoDTO, AtualizarBancoDTO } from './model';
import { PaginatedResponse, Pagination } from '../types/common';

/**
 * Interface do provider (repositório) de Banco
 */
export interface IBancoProvider {
  /**
   * Cria um novo banco
   */
  criar(dados: CriarBancoDTO): Promise<Banco>;

  /**
   * Busca um banco por ID
   */
  buscarPorId(id: string): Promise<Banco | null>;

  /**
   * Busca um banco por código
   */
  buscarPorCodigo(codigo: string): Promise<Banco | null>;

  /**
   * Lista todos os bancos com paginação
   */
  listar(pagination: Pagination): Promise<PaginatedResponse<Banco>>;

  /**
   * Atualiza um banco
   */
  atualizar(id: string, dados: AtualizarBancoDTO): Promise<Banco>;

  /**
   * Remove um banco
   */
  remover(id: string): Promise<void>;

  /**
   * Busca bancos que suportam integração
   */
  buscarComIntegracao(): Promise<Banco[]>;
}
