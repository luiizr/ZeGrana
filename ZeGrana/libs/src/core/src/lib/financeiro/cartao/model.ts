import { EntityBase } from '../types/common';
import { Money } from '../types/money';
import { TipoCartao, BandeiraCartao } from '../types/enums';

/**
 * Representa um cartão de crédito ou débito
 */
export interface Cartao extends EntityBase {
  /** ID do usuário */
  usuarioId: string;
  
  /** ID da conta vinculada (para débito) */
  contaId?: string;
  
  /** Nome do cartão */
  nome: string;
  
  /** Tipo do cartão */
  tipo: TipoCartao;
  
  /** Bandeira do cartão */
  bandeira: BandeiraCartao;
  
  /** Últimos 4 dígitos */
  ultimos4Digitos?: string;
  
  /** Token do cartão (nunca armazenar PAN completo) */
  token?: string;
  
  /** Limite de crédito (apenas para cartões de crédito) */
  limiteCredito?: Money;
  
  /** Limite disponível atual */
  limiteDisponivel?: Money;
  
  /** Dia de vencimento da fatura (1-31) */
  diaVencimento?: number;
  
  /** Dia de fechamento da fatura (1-31) */
  diaFechamento?: number;
  
  /** Melhor dia para compra (automaticamente calculado) */
  melhorDiaCompra?: number;
  
  /** Cor para exibição */
  cor?: string;
  
  /** Se o cartão está ativo */
  ativo: boolean;
  
  /** Observações */
  observacoes?: string;
}

/**
 * Representa uma fatura de cartão
 */
export interface FaturaCartao extends EntityBase {
  /** ID do cartão */
  cartaoId: string;
  
  /** Data de fechamento */
  dataFechamento: Date;
  
  /** Data de vencimento */
  dataVencimento: Date;
  
  /** Valor total da fatura */
  valorTotal: Money;
  
  /** Valor pago */
  valorPago: Money;
  
  /** Saldo restante */
  saldoRestante: Money;
  
  /** Se a fatura está fechada */
  fechada: boolean;
  
  /** Se a fatura está paga */
  paga: boolean;
  
  /** ID da transação de pagamento (quando paga) */
  transacaoPagamentoId?: string;
}

/**
 * DTO para criar um novo cartão
 */
export interface CriarCartaoDTO {
  usuarioId: string;
  contaId?: string;
  nome: string;
  tipo: TipoCartao;
  bandeira: BandeiraCartao;
  ultimos4Digitos?: string;
  limiteCredito?: Money;
  diaVencimento?: number;
  diaFechamento?: number;
  cor?: string;
  observacoes?: string;
}

/**
 * DTO para atualizar um cartão
 */
export interface AtualizarCartaoDTO {
  nome?: string;
  contaId?: string;
  limiteCredito?: Money;
  diaVencimento?: number;
  diaFechamento?: number;
  cor?: string;
  ativo?: boolean;
  observacoes?: string;
}

/**
 * Filtros para buscar cartões
 */
export interface FiltrosCartaoDTO {
  usuarioId: string;
  tipo?: TipoCartao;
  ativo?: boolean;
  contaId?: string;
}
