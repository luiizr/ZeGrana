// Tipos genéricos que podem ser adaptados para qualquer banco de dados
export type DirecaoOrdenacao = 'desc' | 'asc' | 'ASC' | 'DESC'

// Operadores genéricos que cobrem a maioria dos bancos de dados
export type OperadorFiltro =
    | 'igual'           // = ou == 
    | 'diferente'       // <> ou != 
    | 'menor'           // <
    | 'menor_igual'     // <=
    | 'maior'           // >
    | 'maior_igual'     // >=
    | 'contem'          // LIKE %valor% ou array-contains
    | 'comeca_com'      // LIKE valor% ou startsWith
    | 'termina_com'     // LIKE %valor ou endsWith
    | 'em'              // IN ou array-contains-any
    | 'nao_em'          // NOT IN ou not-in
    | 'entre'           // BETWEEN
    | 'nulo'            // IS NULL ou null check
    | 'nao_nulo'        // IS NOT NULL ou not null check
    | 'regex'           // REGEXP ou regex match
    | 'texto_completo'  // Full-text search

export interface Filtro {
    campo: string
    operador: OperadorFiltro
    valor: unknown
    valorFinal?: unknown // Para operador 'entre'
}

export interface Pagina<T = Record<string, unknown>> {
    dados: T[]
    proximo?: () => Promise<Pagina<T>>
    total: number
    temProxima?: boolean
    offset?: number
    limite?: number
}

export interface ComandoBatch {
    identificador: string // Pode ser tabela, coleção, índice, etc.
    entidade: Record<string, unknown>
    id?: string
    operacao: 'salvar' | 'excluir' | 'atualizar' | 'inserir'
}

export interface EventoMudanca<T = Record<string, unknown>> {
    dados: T
    tipo: "adicionado" | "modificado" | "excluido"
    id?: string
}

export interface Ordenacao {
    campo: string
    direcao: DirecaoOrdenacao
}

// Tipos genéricos para diferentes sistemas
export type Identificador = string | number
export type ConteudoArquivo = Uint8Array | Blob | string | ArrayBuffer

// Callback para escuta em tempo real (real-time listeners)
export type CallbackMudanca<T = Record<string, unknown>> = (eventos: EventoMudanca<T>[]) => void

// Função para cancelar escuta (unsubscribe)
export type CancelarEscuta = () => void

/**
 * Interface genérica para provedor de dados
 * Pode ser implementada por qualquer tipo de banco (SQL, NoSQL, etc.)
 */
export default interface ProvedorDados {
    
    // === OPERAÇÕES DE ESCRITA ===
    
    /**
     * Salva uma entidade no repositório de dados
     * @param repositorio - Nome do repositório (tabela, coleção, etc.)
     * @param entidade - Dados a serem salvos
     * @param id - ID opcional da entidade
     * @returns ID da entidade salva
     */
    salvar<T = Record<string, unknown>>(
        repositorio: string, 
        entidade: Record<string, unknown>, 
        id?: Identificador
    ): Promise<T>

    /**
     * Salva múltiplas entidades de uma vez
     */
    salvarVarios(
        repositorio: string, 
        entidades: Record<string, unknown>[]
    ): Promise<void>

    /**
     * Atualiza campos específicos de uma entidade
     */
    atualizarCampos(
        repositorio: string, 
        id: Identificador, 
        campos: Record<string, unknown>
    ): Promise<void>

    /**
     * Exclui uma entidade por ID
     */
    excluir(repositorio: string, id: Identificador): Promise<boolean>

    /**
     * Exclui múltiplas entidades
     */
    excluirVarios(repositorio: string, ids: Identificador[]): Promise<void>

    // === OPERAÇÕES DE LEITURA ===

    /**
     * Busca uma entidade por ID
     */
    buscarPorId<T = Record<string, unknown>>(
        repositorio: string, 
        id: Identificador
    ): Promise<T | null>

    /**
     * Busca múltiplas entidades por IDs
     */
    buscarPorIds<T = Record<string, unknown>>(
        repositorio: string, 
        ids: Identificador[]
    ): Promise<T[]>

    /**
     * Busca todas as entidades de um repositório
     */
    buscarTodos<T = Record<string, unknown>>(
        repositorio: string,
        ordenacao?: Ordenacao
    ): Promise<T[]>

    /**
     * Busca entidades com filtros
     */
    buscarComFiltros<T = Record<string, unknown>>(
        repositorio: string,
        filtros: Filtro[],
        ordenacao?: Ordenacao,
        limite?: number
    ): Promise<T[]>

    /**
     * Busca com paginação
     */
    buscarPaginado<T = Record<string, unknown>>(
        repositorio: string,
        ordenacao: Ordenacao,
        limite?: number,
        offset?: number,
        filtros?: Filtro[]
    ): Promise<Pagina<T>>

    /**
     * Busca a primeira entidade que atende aos filtros
     */
    buscarPrimeiro<T = Record<string, unknown>>(
        repositorio: string,
        filtros?: Filtro[]
    ): Promise<T | null>

    /**
     * Busca textual (full-text search quando disponível)
     */
    buscarTexto<T = Record<string, unknown>>(
        repositorio: string,
        texto: string,
        campos?: string[],
        limite?: number
    ): Promise<T[]>

    // === OPERAÇÕES DE CONTAGEM E VERIFICAÇÃO ===

    /**
     * Verifica se uma entidade existe
     */
    existe(repositorio: string, id: Identificador): Promise<boolean>

    /**
     * Conta o número de registros
     */
    contar(repositorio: string, filtros?: Filtro[]): Promise<number>

    // === OPERAÇÕES EM LOTE E TRANSAÇÕES ===

    /**
     * Executa operações em lote
     */
    executarLote(operacoes: ComandoBatch[]): Promise<void>

    /**
     * Executa operações dentro de uma transação
     */
    executarTransacao(operacoes: ComandoBatch[]): Promise<void>

    // === OPERAÇÕES DE TEMPO REAL (OPCIONAL) ===

    /**
     * Escuta mudanças em uma entidade específica
     * (Para bancos que suportam real-time)
     */
    escutarEntidade?<T = Record<string, unknown>>(
        repositorio: string,
        id: Identificador,
        callback: CallbackMudanca<T>
    ): CancelarEscuta

    /**
     * Escuta mudanças em uma consulta
     * (Para bancos que suportam real-time)
     */
    escutarConsulta?<T = Record<string, unknown>>(
        repositorio: string,
        filtros: Filtro[],
        callback: CallbackMudanca<T>,
        ordenacao?: Ordenacao
    ): CancelarEscuta

    // === OPERAÇÕES ESPECIALIZADAS (OPCIONAL) ===

    /**
     * Adiciona item a um array (para bancos NoSQL)
     */
    adicionarAoArray?(
        repositorio: string,
        id: Identificador,
        campo: string,
        valor: unknown
    ): Promise<void>

    /**
     * Upload de arquivos/mídia (quando suportado)
     */
    uploadArquivo?(
        nome: string,
        conteudo: ConteudoArquivo,
        tipoMime: string
    ): Promise<string>

    // === UTILITÁRIOS ===

    /**
     * Valida a conexão com o banco de dados
     */
    validarConexao(): Promise<boolean>

    /**
     * Executa uma consulta customizada (específica do banco)
     * Para casos avançados onde a interface genérica não é suficiente
     */
    executarConsultaCustomizada?<T = Record<string, unknown>>(
        consulta: string,
        parametros?: unknown[]
    ): Promise<T[]>
}