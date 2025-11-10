import { EntityBase } from '../types/common';
import { Money } from '../types/money';
import { TipoTransacao, StatusTransacao } from '../types/enums';

/**
 * Representa uma divisão de transação (split)
 */
export interface TransacaoDivisao {
  id?: string;
  /** Valor desta divisão */
  valor: Money;
  /** ID da categoria */
  categoriaId?: string;
  /** Observação específica desta divisão */
  observacao?: string;
}

/**
 * Representa uma transação financeira
 */
export interface Transacao extends EntityBase {
  /** ID do usuário */
  usuarioId: string;
  
  /** ID da conta de origem/destino */
  contaId: string;
  
  /** ID do cartão (se aplicável) */
  cartaoId?: string;
  
  /** Tipo de transação */
  tipo: TipoTransacao;
  
  /** Valor da transação */
  valor: Money;
  
  /** Moeda da transação */
  moeda: string;
  
  /** Data da transação */
  data: Date;
  
  /** Data de lançamento/postagem (pode ser diferente da data) */
  dataLancamento?: Date;
  
  /** Descrição da transação */
  descricao: string;
  
  /** ID da categoria */
  categoriaId?: string;
  
  /** ID do favorecido/comerciante */
  favorecidoId?: string;
  
  /** Tags para organização */
  tags: string[];
  
  /** Status da transação */
  status: StatusTransacao;
  
  /** Divisões da transação (se houver split) */
  divisoes?: TransacaoDivisao[];
  
  /** Referência externa (para deduplicação em imports) */
  referencia?: string;
  
  /** ID da transação relacionada (para transferências) */
  transacaoRelacionadaId?: string;
  
  /** ID da parcela (se for pagamento de parcela) */
  parcelaId?: string;
  
  /** Número da parcela (ex: 1/12) */
  numeroParcela?: number;
  
  /** Total de parcelas */
  totalParcelas?: number;
  
  /** Observações */
  observacoes?: string;
  
  /** Anexos (IDs de arquivos) */
  anexos?: string[];
  
  /** Se é uma transação recorrente */
  recorrente: boolean;
  
  /** ID da transação recorrente pai (se gerada automaticamente) */
  recorrenteId?: string;
}

/**
 * DTO para criar uma nova transação
 */
export interface CriarTransacaoDTO {
  usuarioId: string;
  contaId: string;
  cartaoId?: string;
  tipo: TipoTransacao;
  valor: Money;
  data: Date;
  descricao: string;
  categoriaId?: string;
  favorecidoId?: string;
  tags?: string[];
  status?: StatusTransacao;
  divisoes?: Omit<TransacaoDivisao, 'id'>[];
  observacoes?: string;
  anexos?: string[];
  numeroParcela?: number;
  totalParcelas?: number;
  recorrente?: boolean;
}

/**
 * DTO para criar uma transferência (cria 2 transações automaticamente)
 */
export interface CriarTransferenciaDTO {
  usuarioId: string;
  contaOrigemId: string;
  contaDestinoId: string;
  valor: Money;
  data: Date;
  descricao: string;
  observacoes?: string;
  tags?: string[];
}

/**
 * DTO para atualizar uma transação
 */
export interface AtualizarTransacaoDTO {
  contaId?: string;
  cartaoId?: string;
  valor?: Money;
  data?: Date;
  descricao?: string;
  categoriaId?: string;
  favorecidoId?: string;
  tags?: string[];
  status?: StatusTransacao;
  divisoes?: TransacaoDivisao[];
  observacoes?: string[];
  anexos?: string[];
  transacaoRelacionadaId?: string;
}

/**
 * Filtros para buscar transações
 */
export interface FiltrosTransacaoDTO {
  usuarioId: string;
  contaIds?: string[];
  cartaoIds?: string[];
  categoriaIds?: string[];
  tipo?: TipoTransacao;
  status?: StatusTransacao[];
  dataInicio?: Date;
  dataFim?: Date;
  valorMinimo?: string;
  valorMaximo?: string;
  tags?: string[];
  descricao?: string; // busca por texto
  recorrente?: boolean;
}

/**
 * Resultado de análise de gastos
 */
export interface ResumoGastos {
  totalReceitas: Money;
  totalDespesas: Money;
  saldoPeriodo: Money;
  porCategoria: Array<{
    categoriaId: string;
    categoriaNome: string;
    total: Money;
    percentual: number;
  }>;
  porConta: Array<{
    contaId: string;
    contaNome: string;
    total: Money;
  }>;
}
