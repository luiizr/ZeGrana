/**
 * Tipo de conta bancária
 */
export enum TipoConta {
  CORRENTE = 'corrente',
  POUPANCA = 'poupanca',
  INVESTIMENTO = 'investimento',
  DINHEIRO = 'dinheiro',
}

/**
 * Tipo de transação
 */
export enum TipoTransacao {
  RECEITA = 'receita',
  DESPESA = 'despesa',
  TRANSFERENCIA = 'transferencia',
}

/**
 * Status de uma transação
 */
export enum StatusTransacao {
  PENDENTE = 'pendente',
  CONFIRMADA = 'confirmada',
  RECONCILIADA = 'reconciliada',
  CANCELADA = 'cancelada',
}

/**
 * Tipo de cartão
 */
export enum TipoCartao {
  CREDITO = 'credito',
  DEBITO = 'debito',
  MULTIPLO = 'multiplo',
}

/**
 * Bandeira do cartão
 */
export enum BandeiraCartao {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  ELO = 'elo',
  AMEX = 'amex',
  HIPERCARD = 'hipercard',
  OUTROS = 'outros',
}

/**
 * Status de uma parcela
 */
export enum StatusParcela {
  ABERTA = 'aberta',
  PAGA = 'paga',
  ATRASADA = 'atrasada',
  CANCELADA = 'cancelada',
}

/**
 * Tipo de categoria (receita ou despesa)
 */
export enum TipoCategoria {
  RECEITA = 'receita',
  DESPESA = 'despesa',
}

/**
 * Tipo de recorrência
 */
export enum TipoRecorrencia {
  DIARIA = 'diaria',
  SEMANAL = 'semanal',
  MENSAL = 'mensal',
  BIMESTRAL = 'bimestral',
  TRIMESTRAL = 'trimestral',
  SEMESTRAL = 'semestral',
  ANUAL = 'anual',
}

/**
 * Tipo de amortização de empréstimo
 */
export enum TipoAmortizacao {
  PRICE = 'PRICE', // Parcelas fixas
  SAC = 'SAC', // Sistema de Amortização Constante
  SAM = 'SAM', // Sistema de Amortização Misto
}

/**
 * Período para orçamentos e relatórios
 */
export enum Periodo {
  SEMANAL = 'semanal',
  MENSAL = 'mensal',
  TRIMESTRAL = 'trimestral',
  SEMESTRAL = 'semestral',
  ANUAL = 'anual',
}
