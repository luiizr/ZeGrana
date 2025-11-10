/**
 * Representa um valor monetário com moeda
 * Use sempre string para amount (decimal preciso) - nunca use number para dinheiro
 */
export interface Money {
  /** Valor em formato string decimal (ex: "1234.56") */
  amount: string;
  /** Código da moeda ISO 4217 (ex: "BRL", "USD") */
  currency: string;
}

/**
 * Cria um objeto Money
 */
export function createMoney(amount: string | number, currency = 'BRL'): Money {
  return {
    amount: typeof amount === 'number' ? amount.toFixed(2) : amount,
    currency,
  };
}

/**
 * Converte Money para número (use apenas para exibição)
 */
export function moneyToNumber(money: Money): number {
  return parseFloat(money.amount);
}

/**
 * Soma dois valores Money (mesma moeda)
 */
export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot add different currencies: ${a.currency} and ${b.currency}`);
  }
  const sum = (parseFloat(a.amount) + parseFloat(b.amount)).toFixed(2);
  return { amount: sum, currency: a.currency };
}

/**
 * Subtrai dois valores Money (mesma moeda)
 */
export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot subtract different currencies: ${a.currency} and ${b.currency}`);
  }
  const diff = (parseFloat(a.amount) - parseFloat(b.amount)).toFixed(2);
  return { amount: diff, currency: a.currency };
}

/**
 * Multiplica Money por um fator
 */
export function multiplyMoney(money: Money, factor: number): Money {
  const result = (parseFloat(money.amount) * factor).toFixed(2);
  return { amount: result, currency: money.currency };
}
