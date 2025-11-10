import { ICartaoProvider } from './provider';
import { CriarCartaoDTO, AtualizarCartaoDTO, Cartao, FiltrosCartaoDTO, FaturaCartao } from './model';
import { Validator, MoneyValidator } from '../shared/validators';
import { TipoCartao } from '../types/enums';
import { DateRange } from '../types/common';

/**
 * Serviço de negócio para Cartão
 */
export class CartaoService {
  constructor(private readonly cartaoProvider: ICartaoProvider) {}

  /**
   * Cria um novo cartão com validações
   */
  async criar(dados: CriarCartaoDTO): Promise<Cartao> {
    // Validações
    if (!Validator.isValidUUID(dados.usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    if (!Validator.isNotEmpty(dados.nome)) {
      throw new Error('Nome do cartão é obrigatório');
    }

    if (dados.contaId && !Validator.isValidUUID(dados.contaId)) {
      throw new Error('ID de conta inválido');
    }

    // Validações específicas para cartão de crédito
    if (dados.tipo === TipoCartao.CREDITO) {
      if (!dados.limiteCredito) {
        throw new Error('Limite de crédito é obrigatório para cartões de crédito');
      }

      MoneyValidator.validateMoney(dados.limiteCredito.amount);
      if (!MoneyValidator.isPositive(dados.limiteCredito.amount)) {
        throw new Error('Limite de crédito deve ser positivo');
      }

      if (dados.diaVencimento !== undefined) {
        if (!Validator.isInRange(dados.diaVencimento, 1, 31)) {
          throw new Error('Dia de vencimento deve estar entre 1 e 31');
        }
      }

      if (dados.diaFechamento !== undefined) {
        if (!Validator.isInRange(dados.diaFechamento, 1, 31)) {
          throw new Error('Dia de fechamento deve estar entre 1 e 31');
        }
      }
    }

    return this.cartaoProvider.criar(dados);
  }

  /**
   * Busca um cartão por ID
   */
  async buscarPorId(id: string): Promise<Cartao> {
    if (!Validator.isValidUUID(id)) {
      throw new Error('ID de cartão inválido');
    }

    const cartao = await this.cartaoProvider.buscarPorId(id);
    if (!cartao) {
      throw new Error('Cartão não encontrado');
    }

    return cartao;
  }

  /**
   * Lista cartões do usuário
   */
  async listarPorUsuario(usuarioId: string, apenasAtivos = true): Promise<Cartao[]> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    const filtros: FiltrosCartaoDTO = {
      usuarioId,
      ativo: apenasAtivos ? true : undefined,
    };

    return this.cartaoProvider.listar(filtros);
  }

  /**
   * Lista apenas cartões de crédito
   */
  async listarCartoesCredito(usuarioId: string): Promise<Cartao[]> {
    if (!Validator.isValidUUID(usuarioId)) {
      throw new Error('ID de usuário inválido');
    }

    return this.cartaoProvider.listar({
      usuarioId,
      tipo: TipoCartao.CREDITO,
      ativo: true,
    });
  }

  /**
   * Atualiza um cartão
   */
  async atualizar(id: string, dados: AtualizarCartaoDTO): Promise<Cartao> {
    await this.buscarPorId(id); // Verifica se existe

    if (dados.nome !== undefined && !Validator.isNotEmpty(dados.nome)) {
      throw new Error('Nome do cartão não pode ser vazio');
    }

    if (dados.limiteCredito) {
      MoneyValidator.validateMoney(dados.limiteCredito.amount);
      if (!MoneyValidator.isPositive(dados.limiteCredito.amount)) {
        throw new Error('Limite de crédito deve ser positivo');
      }
    }

    if (dados.diaVencimento !== undefined && !Validator.isInRange(dados.diaVencimento, 1, 31)) {
      throw new Error('Dia de vencimento deve estar entre 1 e 31');
    }

    if (dados.diaFechamento !== undefined && !Validator.isInRange(dados.diaFechamento, 1, 31)) {
      throw new Error('Dia de fechamento deve estar entre 1 e 31');
    }

    return this.cartaoProvider.atualizar(id, dados);
  }

  /**
   * Desativa um cartão
   */
  async desativar(id: string): Promise<Cartao> {
    return this.atualizar(id, { ativo: false });
  }

  /**
   * Ativa um cartão
   */
  async ativar(id: string): Promise<Cartao> {
    return this.atualizar(id, { ativo: true });
  }

  /**
   * Remove um cartão
   */
  async remover(id: string): Promise<void> {
    await this.buscarPorId(id);
    return this.cartaoProvider.remover(id);
  }

  /**
   * Gera a fatura do cartão para um período
   */
  async gerarFatura(cartaoId: string, periodo: DateRange): Promise<FaturaCartao> {
    await this.buscarPorId(cartaoId);
    return this.cartaoProvider.gerarFatura(cartaoId, periodo);
  }

  /**
   * Lista faturas de um cartão
   */
  async listarFaturas(cartaoId: string): Promise<FaturaCartao[]> {
    await this.buscarPorId(cartaoId);
    return this.cartaoProvider.listarFaturas(cartaoId);
  }

  /**
   * Calcula o melhor dia para compra (maior prazo até vencimento)
   */
  calcularMelhorDiaCompra(diaFechamento: number, diaVencimento: number): number {
    // O melhor dia é logo após o fechamento da fatura
    return diaFechamento < 31 ? diaFechamento + 1 : 1;
  }
}
