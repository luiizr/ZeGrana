/**
 * Validações para valores monetários
 */
export class MoneyValidator {
  static isPositive(amount: string): boolean {
    return parseFloat(amount) > 0;
  }

  static isNonNegative(amount: string): boolean {
    return parseFloat(amount) >= 0;
  }

  static isValidDecimal(amount: string): boolean {
    return /^-?\d+(\.\d{1,2})?$/.test(amount);
  }

  static validateMoney(amount: string, allowNegative = false): void {
    if (!this.isValidDecimal(amount)) {
      throw new Error('Valor monetário inválido. Use formato decimal com até 2 casas decimais.');
    }

    if (!allowNegative && parseFloat(amount) < 0) {
      throw new Error('Valor monetário não pode ser negativo.');
    }
  }
}

/**
 * Validações de datas
 */
export class DateValidator {
  static isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  static isFutureDate(date: Date): boolean {
    return date.getTime() > Date.now();
  }

  static isPastDate(date: Date): boolean {
    return date.getTime() < Date.now();
  }

  static isDateInRange(date: Date, inicio: Date, fim: Date): boolean {
    return date >= inicio && date <= fim;
  }
}

/**
 * Validações gerais
 */
export class Validator {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isNotEmpty(value: string | null | undefined): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
  }

  static isValidUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }
}
