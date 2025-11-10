import { IBancoProvider } from './provider';
import { CriarBancoDTO, AtualizarBancoDTO, Banco } from './model';
import { Validator } from '../shared/validators';
import { Pagination } from '../types/common';

/**
 * Serviço de negócio para Banco
 */
export class BancoService {
  constructor(private readonly bancoProvider: IBancoProvider) {}

  /**
   * Cria um novo banco com validações
   */
  async criar(dados: CriarBancoDTO): Promise<Banco> {
    // Validações
    if (!Validator.isNotEmpty(dados.nome)) {
      throw new Error('Nome do banco é obrigatório');
    }

    if (dados.codigo) {
      const bancoExistente = await this.bancoProvider.buscarPorCodigo(dados.codigo);
      if (bancoExistente) {
        throw new Error(`Já existe um banco com o código ${dados.codigo}`);
      }
    }

    const pais = dados.pais || 'BR';
    const suportaIntegracao = dados.suportaIntegracao ?? false;

    return this.bancoProvider.criar({
      ...dados,
      pais,
      suportaIntegracao,
    });
  }

  /**
   * Busca um banco por ID
   */
  async buscarPorId(id: string): Promise<Banco> {
    if (!Validator.isValidUUID(id)) {
      throw new Error('ID de banco inválido');
    }

    const banco = await this.bancoProvider.buscarPorId(id);
    if (!banco) {
      throw new Error('Banco não encontrado');
    }

    return banco;
  }

  /**
   * Lista todos os bancos
   */
  async listar(pagination: Pagination = { page: 1, limit: 50 }) {
    return this.bancoProvider.listar(pagination);
  }

  /**
   * Atualiza um banco
   */
  async atualizar(id: string, dados: AtualizarBancoDTO): Promise<Banco> {
    await this.buscarPorId(id); // Verifica se existe

    if (dados.nome !== undefined && !Validator.isNotEmpty(dados.nome)) {
      throw new Error('Nome do banco não pode ser vazio');
    }

    return this.bancoProvider.atualizar(id, dados);
  }

  /**
   * Remove um banco
   */
  async remover(id: string): Promise<void> {
    await this.buscarPorId(id); // Verifica se existe
    return this.bancoProvider.remover(id);
  }

  /**
   * Lista bancos que suportam integração automática
   */
  async listarComIntegracao(): Promise<Banco[]> {
    return this.bancoProvider.buscarComIntegracao();
  }
}
