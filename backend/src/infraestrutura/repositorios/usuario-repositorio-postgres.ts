import { Usuario } from '../../dominio/entidades/usuario.js';
import { UsuarioRepositorio } from '../../dominio/repositorios/usuario-repositorio.js';
import { banco } from '../banco/conexao.js';
const paraUsuario = (linha: Record<string, unknown>): Usuario => ({ id: String(linha.id), nome: String(linha.nome), email: String(linha.email), senhaHash: String(linha.senha_hash), criadoEm: new Date(String(linha.criado_em)) });
export class UsuarioRepositorioPostgres implements UsuarioRepositorio {
  async buscarPorEmail(email: string): Promise<Usuario | null> { const { rows } = await banco.query('SELECT * FROM usuarios WHERE email = $1', [email]); return rows[0] ? paraUsuario(rows[0]) : null; }
  async buscarPorId(id: string): Promise<Usuario | null> { const { rows } = await banco.query('SELECT * FROM usuarios WHERE id = $1', [id]); return rows[0] ? paraUsuario(rows[0]) : null; }
  async criar(nome: string, email: string, senhaHash: string): Promise<Usuario> { const { rows } = await banco.query('INSERT INTO usuarios (nome,email,senha_hash) VALUES ($1,$2,$3) RETURNING *', [nome, email, senhaHash]); return paraUsuario(rows[0]); }
}
