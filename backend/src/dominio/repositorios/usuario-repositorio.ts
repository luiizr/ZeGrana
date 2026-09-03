import { Usuario } from '../entidades/usuario.js';
export interface UsuarioRepositorio { buscarPorEmail(email: string): Promise<Usuario | null>; buscarPorId(id: string): Promise<Usuario | null>; criar(nome: string, email: string, senhaHash: string): Promise<Usuario>; }
