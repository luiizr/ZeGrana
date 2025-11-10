import { EntityBase } from '../types/common';
import { Money } from '../types/money';
import { Periodo } from '../types/enums';

/**
 * Representa um orçamento para uma categoria
 */
export interface Orcamento extends EntityBase {
  /** ID do usuário */
  usuarioId: string;
  
  /** ID da categoria */
  categoriaId: string;
  
  /** Nome do orçamento */
  nome: string;
  
  /** Período do orçamento */
  periodo: Periodo;
  
  /** Valor planejado */
  valorPlanejado: Money;
  
  /** Valor gasto no período atual */
  valorGasto: Money;
  
  /** Percentual utilizado (0-100) */
  percentualUtilizado: number;
  
  /** Data de início do período atual */
  inicioPeriodo: Date;
  
  /** Data de fim do período atual */
  fimPeriodo: Date;
  
  /** Se deve alertar quando atingir limite */
  alertar: boolean;
  
  /** Percentual para alertar (ex: 80 = alerta aos 80%) */
  percentualAlerta?: number;
  
  /** Cor para exibição */
  cor?: string;
  
  /** Se o orçamento está ativo */
  ativo: boolean;
  
  /** Observações */
  observacoes?: string;
}

/**
 * Histórico de um orçamento (períodos anteriores)
 */
export interface HistoricoOrcamento extends EntityBase {
  /** ID do orçamento */
  orcamentoId: string;
  
  /** Data de início do período */
  inicioPeriodo: Date;
  
  /** Data de fim do período */
  fimPeriodo: Date;
  
  /** Valor planejado neste período */
  valorPlanejado: Money;
  
  /** Valor efetivamente gasto */
  valorGasto: Money;
  
  /** Percentual utilizado */
  percentualUtilizado: number;
  
  /** Se ficou dentro do orçamento */
  dentroDoPlanejado: boolean;
}

/**
 * DTO para criar um novo orçamento
 */
export interface CriarOrcamentoDTO {
  usuarioId: string;
  categoriaId: string;
  nome: string;
  periodo: Periodo;
  valorPlanejado: Money;
  alertar?: boolean;
  percentualAlerta?: number;
  cor?: string;
  observacoes?: string;
}

/**
 * DTO para atualizar um orçamento
 */
export interface AtualizarOrcamentoDTO {
  nome?: string;
  valorPlanejado?: Money;
  alertar?: boolean;
  percentualAlerta?: number;
  cor?: string;
  ativo?: boolean;
  observacoes?: string;
}

/**
 * Resumo geral de orçamentos do usuário
 */
export interface ResumoOrcamentos {
  totalPlanejado: Money;
  totalGasto: Money;
  percentualGeralUtilizado: number;
  orcamentos: Array<{
    orcamentoId: string;
    categoriaNome: string;
    valorPlanejado: Money;
    valorGasto: Money;
    percentualUtilizado: number;
    dentroDoPlanejado: boolean;
    emAlerta: boolean;
  }>;
}
