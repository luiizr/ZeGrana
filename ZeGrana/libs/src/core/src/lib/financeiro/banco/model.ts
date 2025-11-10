import { EntityBase } from '../types/common';

/**
 * Representa uma instituição bancária
 */
export interface Banco extends EntityBase {
  /** Nome do banco */
  nome: string;
  
  /** Código do banco (ex: 001, 237, 341) */
  codigo?: string;
  
  /** País do banco */
  pais: string;
  
  /** URL do logo do banco */
  logoUrl?: string;
  
  /** Se suporta integração automática */
  suportaIntegracao: boolean;
}

/**
 * DTO para criar um novo banco
 */
export interface CriarBancoDTO {
  nome: string;
  codigo?: string;
  pais?: string;
  logoUrl?: string;
  suportaIntegracao?: boolean;
}

/**
 * DTO para atualizar um banco
 */
export interface AtualizarBancoDTO {
  nome?: string;
  codigo?: string;
  pais?: string;
  logoUrl?: string;
  suportaIntegracao?: boolean;
}
