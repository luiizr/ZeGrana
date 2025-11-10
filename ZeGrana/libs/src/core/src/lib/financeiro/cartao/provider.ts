import { Cartao, CriarCartaoDTO, AtualizarCartaoDTO, FiltrosCartaoDTO, FaturaCartao } from './model';
import { DateRange } from '../types/common';
import { Money } from '../types/money';

/**
 * Interface do provider (repositório) de Cartão
 */
export interface ICartaoProvider {
  /**
   * Cria um novo cartão
   */
  criar(dados: CriarCartaoDTO): Promise<Cartao>;

  /**
   * Busca um cartão por ID
   */
  buscarPorId(id: string): Promise<Cartao | null>;

  /**
   * Lista cartões com filtros
   */
  listar(filtros: FiltrosCartaoDTO): Promise<Cartao[]>;

  /**
   * Atualiza um cartão
   */
  atualizar(id: string, dados: AtualizarCartaoDTO): Promise<Cartao>;

  /**
   * Remove um cartão
   */
  remover(id: string): Promise<void>;

  /**
   * Atualiza o limite disponível
   */
  atualizarLimiteDisponivel(id: string, novoLimite: Money): Promise<Cartao>;

  /**
   * Busca cartões ativos do usuário
   */
  buscarAtivosPorUsuario(usuarioId: string): Promise<Cartao[]>;

  /**
   * Gera/busca fatura do cartão para um período
   */
  gerarFatura(cartaoId: string, periodo: DateRange): Promise<FaturaCartao>;

  /**
   * Lista faturas de um cartão
   */
  listarFaturas(cartaoId: string): Promise<FaturaCartao[]>;
}
