export type TipoLancamento = 'DESPESA' | 'RECEBIMENTO';
export type MeioPagamento = 'DINHEIRO' | 'CARTAO';
export interface Lancamento { id: string; usuarioId: string; cartaoId: string | null; tipo: TipoLancamento; titulo: string; categoria: string; valor: string; dataLancamento: string; meioPagamento: MeioPagamento; observacao: string | null; fixo: boolean; pago: boolean; criadoEm: Date; }
export interface CriarLancamento { titulo: string; categoria: string; valor: number; dataLancamento: string; meioPagamento: MeioPagamento; cartaoId?: string; observacao?: string; fixo?: boolean; }
