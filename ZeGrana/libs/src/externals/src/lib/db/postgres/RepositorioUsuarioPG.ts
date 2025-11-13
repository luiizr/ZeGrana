import { ProvedorDados, Filtro, Ordenacao, Pagina, ComandoBatch, Identificador } from '@ze-grana/adapters';
import db from './db';
import { ITask } from 'pg-promise';

export default class ProvedorPostgreSQL implements ProvedorDados {

    // === OPERAÇÕES DE ESCRITA ===

    async salvar<T = Record<string, unknown>>(
        repositorio: string,
        entidade: Record<string, unknown>,
        id?: Identificador
    ): Promise<T> {
        const campos = Object.keys(entidade);
        const valores = Object.values(entidade);
        
        if (id) {
            // UPDATE
            const setClauses = campos.map((campo, index) => `${campo} = $${index + 2}`).join(', ');
            const query = `UPDATE ${repositorio} SET ${setClauses} WHERE id = $1 RETURNING *`;
            const result = await db.one(query, [id, ...valores]);
            return result as T;
        } else {
            // INSERT
            const placeholders = valores.map((_, index) => `$${index + 1}`).join(', ');
            const query = `INSERT INTO ${repositorio} (${campos.join(', ')}) VALUES (${placeholders}) RETURNING *`;
            const result = await db.one(query, valores);
            return result as T;
        }
    }

    async salvarVarios(
        repositorio: string,
        entidades: Record<string, unknown>[]
    ): Promise<void> {
        if (entidades.length === 0) return;

        const campos = Object.keys(entidades[0]);
        const placeholders = campos.map((_, index) => `$${index + 1}`).join(', ');
        const query = `INSERT INTO ${repositorio} (${campos.join(', ')}) VALUES (${placeholders})`;

        await db.tx(async (transaction) => {
            for (const entidade of entidades) {
                await transaction.none(query, Object.values(entidade));
            }
        });
    }

    async atualizarCampos(
        repositorio: string,
        id: Identificador,
        campos: Record<string, unknown>
    ): Promise<void> {
        const camposArray = Object.keys(campos);
        const valores = Object.values(campos);
        const setClauses = camposArray.map((campo, index) => `${campo} = $${index + 2}`).join(', ');
        
        const query = `UPDATE ${repositorio} SET ${setClauses} WHERE id = $1`;
        await db.none(query, [id, ...valores]);
    }

    async excluir(repositorio: string, id: Identificador): Promise<boolean> {
        const query = `DELETE FROM ${repositorio} WHERE id = $1`;
        const result = await db.result(query, [id]);
        return result.rowCount > 0;
    }

    async excluirVarios(repositorio: string, ids: Identificador[]): Promise<void> {
        if (ids.length === 0) return;
        
        const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ');
        const query = `DELETE FROM ${repositorio} WHERE id IN (${placeholders})`;
        await db.none(query, ids);
    }

    // === OPERAÇÕES DE LEITURA ===

    async buscarPorId<T = Record<string, unknown>>(
        repositorio: string,
        id: Identificador
    ): Promise<T | null> {
        const query = `SELECT * FROM ${repositorio} WHERE id = $1`;
        return await db.oneOrNone(query, [id]);
    }

    async buscarPorIds<T = Record<string, unknown>>(
        repositorio: string,
        ids: Identificador[]
    ): Promise<T[]> {
        if (ids.length === 0) return [];
        
        const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ');
        const query = `SELECT * FROM ${repositorio} WHERE id IN (${placeholders})`;
        return await db.manyOrNone(query, ids);
    }

    async buscarTodos<T = Record<string, unknown>>(
        repositorio: string,
        ordenacao?: Ordenacao
    ): Promise<T[]> {
        let query = `SELECT * FROM ${repositorio}`;
        
        if (ordenacao) {
            const direcao = this.converterDirecao(ordenacao.direcao);
            query += ` ORDER BY ${ordenacao.campo} ${direcao}`;
        }
        
        return await db.manyOrNone(query);
    }

    async buscarComFiltros<T = Record<string, unknown>>(
        repositorio: string,
        filtros: Filtro[],
        ordenacao?: Ordenacao,
        limite?: number
    ): Promise<T[]> {
        const { whereClause, parametros } = this.construirWhere(filtros);
        
        let query = `SELECT * FROM ${repositorio}`;
        if (whereClause) {
            query += ` WHERE ${whereClause}`;
        }
        
        if (ordenacao) {
            const direcao = this.converterDirecao(ordenacao.direcao);
            query += ` ORDER BY ${ordenacao.campo} ${direcao}`;
        }
        
        if (limite) {
            query += ` LIMIT ${limite}`;
        }
        
        return await db.manyOrNone(query, parametros);
    }

    async buscarPaginado<T = Record<string, unknown>>(
        repositorio: string,
        ordenacao: Ordenacao,
        limite = 10,
        offset = 0,
        filtros?: Filtro[]
    ): Promise<Pagina<T>> {
        const { whereClause, parametros } = this.construirWhere(filtros || []);
        const direcao = this.converterDirecao(ordenacao.direcao);
        
        // Query para dados
        let queryDados = `SELECT * FROM ${repositorio}`;
        if (whereClause) {
            queryDados += ` WHERE ${whereClause}`;
        }
        queryDados += ` ORDER BY ${ordenacao.campo} ${direcao} LIMIT ${limite} OFFSET ${offset}`;
        
        // Query para total
        let queryTotal = `SELECT COUNT(*) as total FROM ${repositorio}`;
        if (whereClause) {
            queryTotal += ` WHERE ${whereClause}`;
        }
        
        const [dados, totalResult] = await Promise.all([
            db.manyOrNone<T>(queryDados, parametros),
            db.one<{ total: number }>(queryTotal, parametros)
        ]);
        
        const total = parseInt(totalResult.total.toString());
        
        return {
            dados,
            total,
            offset,
            limite,
            temProxima: (offset + limite) < total
        };
    }

    async buscarPrimeiro<T = Record<string, unknown>>(
        repositorio: string,
        filtros?: Filtro[]
    ): Promise<T | null> {
        const { whereClause, parametros } = this.construirWhere(filtros || []);
        
        let query = `SELECT * FROM ${repositorio}`;
        if (whereClause) {
            query += ` WHERE ${whereClause}`;
        }
        query += ` LIMIT 1`;
        
        return await db.oneOrNone(query, parametros);
    }

    async buscarTexto<T = Record<string, unknown>>(
        repositorio: string,
        texto: string,
        campos?: string[],
        limite?: number
    ): Promise<T[]> {
        let query: string;
        let parametros: unknown[];
        
        if (campos && campos.length > 0) {
            // Busca em campos específicos usando ILIKE
            const condicoes = campos.map((campo, index) => `${campo}::text ILIKE $${index + 1}`).join(' OR ');
            query = `SELECT * FROM ${repositorio} WHERE ${condicoes}`;
            parametros = campos.map(() => `%${texto}%`);
        } else {
            // Busca usando full-text search do PostgreSQL (se disponível)
            query = `SELECT * FROM ${repositorio} WHERE to_tsvector('portuguese', *) @@ plainto_tsquery('portuguese', $1)`;
            parametros = [texto];
        }
        
        if (limite) {
            query += ` LIMIT ${limite}`;
        }
        
        return await db.manyOrNone(query, parametros);
    }

    // === OPERAÇÕES DE CONTAGEM E VERIFICAÇÃO ===

    async existe(repositorio: string, id: Identificador): Promise<boolean> {
        const query = `SELECT EXISTS(SELECT 1 FROM ${repositorio} WHERE id = $1) as existe`;
        const result = await db.one<{ existe: boolean }>(query, [id]);
        return result.existe;
    }

    async contar(repositorio: string, filtros?: Filtro[]): Promise<number> {
        const { whereClause, parametros } = this.construirWhere(filtros || []);
        
        let query = `SELECT COUNT(*) as total FROM ${repositorio}`;
        if (whereClause) {
            query += ` WHERE ${whereClause}`;
        }
        
        const result = await db.one<{ total: number }>(query, parametros);
        return parseInt(result.total.toString());
    }

    // === OPERAÇÕES EM LOTE E TRANSAÇÕES ===

    async executarLote(operacoes: ComandoBatch[]): Promise<void> {
        await db.tx(async (transaction) => {
            for (const operacao of operacoes) {
                await this.executarOperacao(transaction, operacao);
            }
        });
    }

    async executarTransacao(operacoes: ComandoBatch[]): Promise<void> {
        return this.executarLote(operacoes);
    }

    // === OPERAÇÕES ESPECIALIZADAS ===

    async adicionarAoArray(
        repositorio: string,
        id: Identificador,
        campo: string,
        valor: unknown
    ): Promise<void> {
        const query = `UPDATE ${repositorio} SET ${campo} = array_append(${campo}, $2) WHERE id = $1`;
        await db.none(query, [id, valor]);
    }

    // === UTILITÁRIOS ===

    async validarConexao(): Promise<boolean> {
        try {
            await db.one('SELECT 1');
            return true;
        } catch {
            return false;
        }
    }

    async executarConsultaCustomizada<T = Record<string, unknown>>(
        consulta: string,
        parametros?: unknown[]
    ): Promise<T[]> {
        return await db.manyOrNone(consulta, parametros);
    }

    // === MÉTODOS PRIVADOS ===

    private construirWhere(filtros: Filtro[]): { whereClause: string; parametros: unknown[] } {
        if (filtros.length === 0) {
            return { whereClause: '', parametros: [] };
        }

        const condicoes: string[] = [];
        const parametros: unknown[] = [];
        let paramIndex = 1;

        for (const filtro of filtros) {
            const { condicao, params } = this.converterFiltro(filtro, paramIndex);
            condicoes.push(condicao);
            parametros.push(...params);
            paramIndex += params.length;
        }

        return {
            whereClause: condicoes.join(' AND '),
            parametros
        };
    }

    private converterFiltro(filtro: Filtro, startIndex: number): { condicao: string; params: unknown[] } {
        const { campo, operador, valor, valorFinal } = filtro;

        switch (operador) {
            case 'igual':
                return { condicao: `${campo} = $${startIndex}`, params: [valor] };
            
            case 'diferente':
                return { condicao: `${campo} <> $${startIndex}`, params: [valor] };
            
            case 'menor':
                return { condicao: `${campo} < $${startIndex}`, params: [valor] };
            
            case 'menor_igual':
                return { condicao: `${campo} <= $${startIndex}`, params: [valor] };
            
            case 'maior':
                return { condicao: `${campo} > $${startIndex}`, params: [valor] };
            
            case 'maior_igual':
                return { condicao: `${campo} >= $${startIndex}`, params: [valor] };
            
            case 'contem':
                return { condicao: `${campo}::text ILIKE $${startIndex}`, params: [`%${valor}%`] };
            
            case 'comeca_com':
                return { condicao: `${campo}::text ILIKE $${startIndex}`, params: [`${valor}%`] };
            
            case 'termina_com':
                return { condicao: `${campo}::text ILIKE $${startIndex}`, params: [`%${valor}`] };
            
            case 'em':
                if (Array.isArray(valor)) {
                    const placeholders = valor.map((_, index) => `$${startIndex + index}`).join(', ');
                    return { condicao: `${campo} IN (${placeholders})`, params: valor };
                }
                return { condicao: `${campo} = $${startIndex}`, params: [valor] };
            
            case 'nao_em':
                if (Array.isArray(valor)) {
                    const placeholders = valor.map((_, index) => `$${startIndex + index}`).join(', ');
                    return { condicao: `${campo} NOT IN (${placeholders})`, params: valor };
                }
                return { condicao: `${campo} <> $${startIndex}`, params: [valor] };
            
            case 'entre':
                return { 
                    condicao: `${campo} BETWEEN $${startIndex} AND $${startIndex + 1}`, 
                    params: [valor, valorFinal] 
                };
            
            case 'nulo':
                return { condicao: `${campo} IS NULL`, params: [] };
            
            case 'nao_nulo':
                return { condicao: `${campo} IS NOT NULL`, params: [] };
            
            case 'regex':
                return { condicao: `${campo}::text ~ $${startIndex}`, params: [valor] };
            
            case 'texto_completo':
                return { 
                    condicao: `to_tsvector('portuguese', ${campo}) @@ plainto_tsquery('portuguese', $${startIndex})`, 
                    params: [valor] 
                };
            
            default:
                throw new Error(`Operador não suportado: ${operador}`);
        }
    }

    private converterDirecao(direcao: string): string {
        const direcaoUpper = direcao.toUpperCase();
        return direcaoUpper === 'DESC' || direcaoUpper === 'ASC' ? direcaoUpper : 'ASC';
    }

    private async executarOperacao(transaction: ITask<object>, operacao: ComandoBatch): Promise<void> {
        const { identificador, entidade, operacao: tipo, id } = operacao;

        switch (tipo) {
            case 'inserir':
            case 'salvar': {
                const campos = Object.keys(entidade);
                const valores = Object.values(entidade);
                const placeholders = valores.map((_, index) => `$${index + 1}`).join(', ');
                const queryInsert = `INSERT INTO ${identificador} (${campos.join(', ')}) VALUES (${placeholders})`;
                await transaction.none(queryInsert, valores);
                break;
            }

            case 'atualizar': {
                if (!id) throw new Error('ID é obrigatório para operação de atualização');
                const camposUpdate = Object.keys(entidade);
                const valoresUpdate = Object.values(entidade);
                const setClauses = camposUpdate.map((campo, index) => `${campo} = $${index + 2}`).join(', ');
                const queryUpdate = `UPDATE ${identificador} SET ${setClauses} WHERE id = $1`;
                await transaction.none(queryUpdate, [id, ...valoresUpdate]);
                break;
            }

            case 'excluir': {
                if (!id) throw new Error('ID é obrigatório para operação de exclusão');
                const queryDelete = `DELETE FROM ${identificador} WHERE id = $1`;
                await transaction.none(queryDelete, [id]);
                break;
            }

            default:
                throw new Error(`Operação não suportada: ${tipo}`);
        }
    }
}