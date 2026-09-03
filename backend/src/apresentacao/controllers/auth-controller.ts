import { Request, Response } from 'express';
import { AutenticarUsuario, RegistrarUsuario } from '../../aplicacao/casos-de-uso/autenticacao.js';
import { UsuarioRepositorio } from '../../dominio/repositorios/usuario-repositorio.js';
import { cadastroSchema, loginSchema } from '../validators/esquemas.js';
export class AuthController {
  constructor(private registrar: RegistrarUsuario, private autenticar: AutenticarUsuario, private usuarios: UsuarioRepositorio) {}
  registrarUsuario = async (req: Request, res: Response): Promise<void> => { const e = cadastroSchema.parse(req.body); const usuario = await this.registrar.executar(e.nome, e.email, e.senha); req.session.regenerate((erro) => { if (erro) throw erro; req.session.usuarioId = usuario.id; res.status(201).json({ usuario }); }); };
  login = async (req: Request, res: Response): Promise<void> => { const e = loginSchema.parse(req.body); const usuario = await this.autenticar.executar(e.email, e.senha); req.session.regenerate((erro) => { if (erro) throw erro; req.session.usuarioId = usuario.id; res.json({ usuario }); }); };
  logout = (req: Request, res: Response): void => { req.session.destroy(() => { res.clearCookie('zegrana.sid', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }).status(204).send(); }); };
  me = async (req: Request, res: Response): Promise<void> => { const usuario = await this.usuarios.buscarPorId(req.session.usuarioId!); if (!usuario) { req.session.destroy(() => undefined); res.status(401).json({ message: 'Sua sessão expirou.' }); return; } res.json({ usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } }); };
}
