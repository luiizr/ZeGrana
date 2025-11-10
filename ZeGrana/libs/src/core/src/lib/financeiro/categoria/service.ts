import { ICategoriaProvider } from './provider';
import { CriarCategoriaDTO, AtualizarCategoriaDTO, Categoria, FiltrosCategoriaDTO } from './model';
import { Validator } from '../shared/validators';
import { TipoCategoria } from '../types/enums';

/**
 * Serviço de negócio para Categoria
 */
export class CategoriaService {
  constructor(private readonly categoriaProvider: ICategoriaProvider) {}

  /**
   * Cria uma nova categoria com validações
   */
  async criar(dados: CriarCategoriaDTO): Promise<Categoria> {
    // Validações
    if (!Validator.isValidUUID(dados.usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    if (!Validator.isNotEmpty(dados.nome)) {
      throw new Error('Nome da categoria é obrigatório');
    }

    if (dados.categoriaPaiId) {
      if (!Validator.isValidUUID(dados.categoriaPaiId)) {
        throw new Error('ID de categoria pai inválido');
      }

      // Verifica se a categoria pai existe
      const categoriaPai = await this.categoriaProvider.buscarPorId(dados.categoriaPaiId);
      if (!categoriaPai) {
        throw new Error('Categoria pai não encontrada');
      }

      // Verifica se o tipo é o mesmo da categoria pai
      if (categoriaPai.tipo !== dados.tipo) {
        throw new Error('Subcategoria deve ter o mesmo tipo da categoria pai');
      }
    }

    return this.categoriaProvider.criar(dados);
  }

  /**
   * Busca uma categoria por ID
   */
  async buscarPorId(id: string): Promise<Categoria> {
    if (!Validator.isValidUUID(id)) {
      throw new Error('ID de categoria inválido');
    }

    const categoria = await this.categoriaProvider.buscarPorId(id);
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    return categoria;
  }

  /**
   * Lista categorias do usuário
   */
  async listarPorUsuario(
    usuarioId: string,
    tipo?: TipoCategoria,
    apenasAtivas = true
  ): Promise<Categoria[]> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    const filtros: FiltrosCategoriaDTO = {
      usuarioId,
      tipo,
      ativa: apenasAtivas ? true : undefined,
    };

    return this.categoriaProvider.listar(filtros);
  }

  /**
   * Lista categorias raiz (sem pai) do usuário
   */
  async listarRaizes(usuarioId: string): Promise<Categoria[]> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    return this.categoriaProvider.buscarRaizes(usuarioId);
  }

  /**
   * Lista subcategorias de uma categoria
   */
  async listarSubcategorias(categoriaPaiId: string): Promise<Categoria[]> {
    if (!Validator.isValidUUID(categoriaPaiId)) {
      throw new Error('ID de categoria pai inválido');
    }

    await this.buscarPorId(categoriaPaiId); // Verifica se existe

    return this.categoriaProvider.buscarSubcategorias(categoriaPaiId);
  }

  /**
   * Atualiza uma categoria
   */
  async atualizar(id: string, dados: AtualizarCategoriaDTO): Promise<Categoria> {
    const categoria = await this.buscarPorId(id);

    if (dados.nome !== undefined && !Validator.isNotEmpty(dados.nome)) {
      throw new Error('Nome da categoria não pode ser vazio');
    }

    if (dados.categoriaPaiId !== undefined) {
      if (dados.categoriaPaiId === id) {
        throw new Error('Categoria não pode ser pai de si mesma');
      }

      if (dados.categoriaPaiId && !Validator.isValidUUID(dados.categoriaPaiId)) {
        throw new Error('ID de categoria pai inválido');
      }

      if (dados.categoriaPaiId) {
        const categoriaPai = await this.categoriaProvider.buscarPorId(dados.categoriaPaiId);
        if (!categoriaPai) {
          throw new Error('Categoria pai não encontrada');
        }

        if (categoriaPai.tipo !== categoria.tipo) {
          throw new Error('Subcategoria deve ter o mesmo tipo da categoria pai');
        }
      }
    }

    return this.categoriaProvider.atualizar(id, dados);
  }

  /**
   * Desativa uma categoria
   */
  async desativar(id: string): Promise<Categoria> {
    return this.atualizar(id, { ativa: false });
  }

  /**
   * Ativa uma categoria
   */
  async ativar(id: string): Promise<Categoria> {
    return this.atualizar(id, { ativa: true });
  }

  /**
   * Remove uma categoria
   */
  async remover(id: string): Promise<void> {
    await this.buscarPorId(id);

    // Verifica se tem subcategorias
    const subcategorias = await this.categoriaProvider.buscarSubcategorias(id);
    if (subcategorias.length > 0) {
      throw new Error('Não é possível remover categoria com subcategorias. Remova as subcategorias primeiro.');
    }

    return this.categoriaProvider.remover(id);
  }
}
