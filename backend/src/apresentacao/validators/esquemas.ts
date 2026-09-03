import { z } from 'zod';
export const cadastroSchema = z.object({ nome: z.string().trim().min(2).max(100), email: z.email().trim().toLowerCase(), senha: z.string().min(8).max(72) });
export const loginSchema = cadastroSchema.pick({ email: true, senha: true });
const data = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const camposLancamento = z.object({ titulo: z.string().trim().min(2).max(120), categoria: z.string().trim().min(2).max(50), valor: z.coerce.number().positive().max(999999999999.99), dataLancamento: data, meioPagamento: z.enum(['DINHEIRO', 'CARTAO']).default('DINHEIRO'), cartaoId: z.uuid().optional(), observacao: z.string().trim().max(500).optional(), fixo: z.boolean().optional() });
export const lancamentoSchema = camposLancamento.superRefine((v, ctx) => { if (v.meioPagamento === 'CARTAO' && !v.cartaoId) ctx.addIssue({ code: 'custom', path: ['cartaoId'], message: 'Selecione um cartão.' }); });
export const atualizarLancamentoSchema = camposLancamento.partial().extend({ pago: z.boolean().optional() }).superRefine((v, ctx) => { if (v.meioPagamento === 'CARTAO' && !v.cartaoId) ctx.addIssue({ code: 'custom', path: ['cartaoId'], message: 'Selecione um cartão.' }); });
export const idSchema = z.object({ id: z.uuid() });
