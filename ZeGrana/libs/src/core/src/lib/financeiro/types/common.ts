/**
 * Base para todas as entidades com timestamps
 */
export interface EntityBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Representa um período de datas
 */
export interface DateRange {
  inicio: Date;
  fim: Date;
}

/**
 * Padrão de recorrência para transações
 */
export interface RecurrencePattern {
  tipo: string; // TipoRecorrencia
  intervalo: number; // a cada quantos períodos
  diasDaSemana?: number[]; // para recorrência semanal (0-6)
  diaMes?: number; // para recorrência mensal (1-31)
  dataFim?: Date; // quando termina a recorrência
  ocorrencias?: number; // quantas vezes vai ocorrer
}

/**
 * Dados de paginação
 */
export interface Pagination {
  page: number;
  limit: number;
  total?: number;
}

/**
 * Resposta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Filtros comuns para consultas
 */
export interface FilterOptions {
  dataInicio?: Date;
  dataFim?: Date;
  categorias?: string[];
  contas?: string[];
  tags?: string[];
  status?: string[];
}
