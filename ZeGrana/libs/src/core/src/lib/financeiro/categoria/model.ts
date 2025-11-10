import { EntityBase } from '../types/common';
import { TipoCategoria } from '../types/enums';

/**
 * Representa uma categoria de transação (receita ou despesa)
 */
export interface Categoria extends EntityBase {
  /** ID do usuário */
  usuarioId: string;
  
  /** Nome da categoria */
  nome: string;
  
  /** Tipo (receita ou despesa) */
  tipo: TipoCategoria;
  
  /** ID da categoria pai (para subcategorias) */
  categoriaPaiId?: string;
  
  /** Cor para exibição */
  cor?: string;
  
  /** Ícone para exibição */
  icone?: string;
  
  /** Se a categoria está ativa */
  ativa: boolean;
  
  /** Ordem de exibição */
  ordem?: number;
}

/**
 * DTO para criar uma nova categoria
 */
export interface CriarCategoriaDTO {
  usuarioId: string;
  nome: string;
  tipo: TipoCategoria;
  categoriaPaiId?: string;
  cor?: string;
  icone?: string;
  ordem?: number;
}

/**
 * DTO para atualizar uma categoria
 */
export interface AtualizarCategoriaDTO {
  nome?: string;
  categoriaPaiId?: string;
  cor?: string;
  icone?: string;
  ativa?: boolean;
  ordem?: number;
}

/**
 * Filtros para buscar categorias
 */
export interface FiltrosCategoriaDTO {
  usuarioId: string;
  tipo?: TipoCategoria;
  ativa?: boolean;
  categoriaPaiId?: string | null; // null para categorias raiz
}
