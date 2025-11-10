import { Categoria, CriarCategoriaDTO, AtualizarCategoriaDTO, FiltrosCategoriaDTO } from './model';

/**
 * Interface do provider (repositório) de Categoria
 */
export interface ICategoriaProvider {
  /**
   * Cria uma nova categoria
   */
  criar(dados: CriarCategoriaDTO): Promise<Categoria>;

  /**
   * Busca uma categoria por ID
   */
  buscarPorId(id: string): Promise<Categoria | null>;

  /**
   * Lista categorias com filtros
   */
  listar(filtros: FiltrosCategoriaDTO): Promise<Categoria[]>;

  /**
   * Atualiza uma categoria
   */
  atualizar(id: string, dados: AtualizarCategoriaDTO): Promise<Categoria>;

  /**
   * Remove uma categoria
   */
  remover(id: string): Promise<void>;

  /**
   * Busca subcategorias de uma categoria
   */
  buscarSubcategorias(categoriaPaiId: string): Promise<Categoria[]>;

  /**
   * Busca categorias raiz (sem pai) do usuário
   */
  buscarRaizes(usuarioId: string): Promise<Categoria[]>;
}
