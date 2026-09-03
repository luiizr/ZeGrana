import { ErroAplicacao } from '../../dominio/erros/erro-aplicacao.js';
import { UsuarioPublico } from '../../dominio/entidades/usuario.js';
import { UsuarioRepositorio } from '../../dominio/repositorios/usuario-repositorio.js';
import { HasherBcrypt } from '../../infraestrutura/criptografia/hasher-bcrypt.js';
const publico = (u: { id: string; nome: string; email: string }): UsuarioPublico => ({ id: u.id, nome: u.nome, email: u.email });
export class RegistrarUsuario { constructor(private usuarios: UsuarioRepositorio, private hasher: HasherBcrypt) {} async executar(nome: string, email: string, senha: string): Promise<UsuarioPublico> { if (await this.usuarios.buscarPorEmail(email)) throw new ErroAplicacao(409, 'Este e-mail já está em uso.'); return publico(await this.usuarios.criar(nome, email, await this.hasher.hash(senha))); } }
export class AutenticarUsuario { constructor(private usuarios: UsuarioRepositorio, private hasher: HasherBcrypt) {} async executar(email: string, senha: string): Promise<UsuarioPublico> { const usuario = await this.usuarios.buscarPorEmail(email); if (!usuario || !(await this.hasher.comparar(senha, usuario.senhaHash))) throw new ErroAplicacao(401, 'E-mail ou senha inválidos.'); return publico(usuario); } }
