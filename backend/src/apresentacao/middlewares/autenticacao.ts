import { NextFunction, Request, Response } from 'express';
import { ErroAplicacao } from '../../dominio/erros/erro-aplicacao.js';
export interface RequestAutenticada extends Request { session: Request['session'] & { usuarioId?: string }; }
export function exigirAutenticacao(req: Request, _res: Response, next: NextFunction): void { if (!req.session.usuarioId) return next(new ErroAplicacao(401, 'Sua sessão expirou. Entre novamente.')); next(); }
export function usuarioId(req: Request): string { const id = req.session.usuarioId; if (!id) throw new ErroAplicacao(401, 'Sua sessão expirou. Entre novamente.'); return id; }
