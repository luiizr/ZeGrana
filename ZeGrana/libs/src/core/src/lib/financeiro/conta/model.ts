import { EntityBase } from '../types/common';
import { Money } from '../types/money';
import { TipoConta } from '../types/enums';

/**
 * Representa uma conta bancária ou carteira
 */
export interface Conta extends EntityBase {
  /** ID do usuário dono da conta */
  usuarioId: string;
  
  /** ID do banco (opcional para contas tipo dinheiro) */
  bancoId?: string;
  
  /** Nome da conta */
  nome: string;
  
  /** Tipo da conta */
  tipo: TipoConta;
  
  /** Moeda da conta */
  moeda: string;
  
  /** Número da conta (mascarado) */
  numeroMascarado?: string;
  
  /** Saldo atual calculado */
  saldo: Money;
  
  /** Saldo disponível (pode ser diferente do saldo se houver reservas) */
  saldoDisponivel?: Money;
  
  /** Cor para exibição na UI */
  cor?: string;
  
  /** Ícone para exibição na UI */
  icone?: string;
  
  /** Se a conta está ativa */
  ativa: boolean;
  
  /** Observações */
  observacoes?: string;
}

/**
 * DTO para criar uma nova conta
 */
export interface CriarContaDTO {
  usuarioId: string;
  bancoId?: string;
  nome: string;
  tipo: TipoConta;
  moeda?: string;
  numeroMascarado?: string;
  saldoInicial?: Money;
  cor?: string;
  icone?: string;
  observacoes?: string;
}

/**
 * DTO para atualizar uma conta
 */
export interface AtualizarContaDTO {
  nome?: string;
  bancoId?: string;
  numeroMascarado?: string;
  cor?: string;
  icone?: string;
  ativa?: boolean;
  observacoes?: string;
}

/**
 * Filtros para buscar contas
 */
export interface FiltrosContaDTO {
  usuarioId: string;
  bancoId?: string;
  tipo?: TipoConta;
  ativa?: boolean;
}
