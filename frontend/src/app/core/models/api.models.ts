export interface Usuario { id: string; nome: string; email?: string; }
export interface Lancamento { id: string; titulo: string; categoria: string; valor: string; dataLancamento: string; tipo: 'DESPESA' | 'RECEBIMENTO'; meioPagamento: 'DINHEIRO' | 'CARTAO'; observacao?: string | null; fixo: boolean; pago: boolean; }
export interface Resumo { saldo: string; receitas: string; despesas: string; }
