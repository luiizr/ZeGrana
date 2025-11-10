import { EntityBase } from '../types/common';
import { Money } from '../types/money';
import { TipoAmortizacao, StatusParcela } from '../types/enums';

/**
 * Representa uma parcela de empréstimo ou financiamento
 */
export interface Parcela extends EntityBase {
  /** ID do empréstimo */
  emprestimoId: string;
  
  /** Número da parcela */
  numero: number;
  
  /** Data de vencimento */
  dataVencimento: Date;
  
  /** Valor total da parcela */
  valor: Money;
  
  /** Valor do principal (amortização) */
  valorPrincipal: Money;
  
  /** Valor dos juros */
  valorJuros: Money;
  
  /** Data do pagamento (se pago) */
  dataPagamento?: Date;
  
  /** Valor efetivamente pago */
  valorPago?: Money;
  
  /** Status da parcela */
  status: StatusParcela;
  
  /** ID da transação de pagamento (quando paga) */
  transacaoId?: string;
}

/**
 * Representa um empréstimo ou financiamento
 */
export interface Emprestimo extends EntityBase {
  /** ID do usuário */
  usuarioId: string;
  
  /** Nome/descrição do empréstimo */
  nome: string;
  
  /** Valor principal (total emprestado) */
  valorPrincipal: Money;
  
  /** Taxa de juros anual (%) */
  taxaJurosAnual: number;
  
  /** Tipo de amortização */
  tipoAmortizacao: TipoAmortizacao;
  
  /** Data de início */
  dataInicio: Date;
  
  /** Prazo em meses */
  prazoMeses: number;
  
  /** Valor total a pagar (principal + juros) */
  valorTotal: Money;
  
  /** Saldo devedor atual */
  saldoDevedor: Money;
  
  /** Parcelas */
  parcelas: Parcela[];
  
  /** Se está ativo */
  ativo: boolean;
  
  /** Observações */
  observacoes?: string;
}

/**
 * DTO para criar um novo empréstimo
 */
export interface CriarEmprestimoDTO {
  usuarioId: string;
  nome: string;
  valorPrincipal: Money;
  taxaJurosAnual: number;
  tipoAmortizacao: TipoAmortizacao;
  dataInicio: Date;
  prazoMeses: number;
  observacoes?: string;
}

/**
 * DTO para atualizar um empréstimo
 */
export interface AtualizarEmprestimoDTO {
  nome?: string;
  observacoes?: string;
  ativo?: boolean;
}

/**
 * DTO para registrar pagamento de parcela
 */
export interface PagarParcelaDTO {
  parcelaId: string;
  contaId: string;
  dataPagamento: Date;
  valorPago: Money;
}

/**
 * Informações do cronograma de amortização
 */
export interface CronogramaAmortizacao {
  parcelas: Array<{
    numero: number;
    dataVencimento: Date;
    valorParcela: Money;
    valorPrincipal: Money;
    valorJuros: Money;
    saldoDevedor: Money;
  }>;
  valorTotal: Money;
  totalJuros: Money;
}
