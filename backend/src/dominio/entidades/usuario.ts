export interface Usuario { id: string; nome: string; email: string; senhaHash: string; criadoEm: Date; }
export type UsuarioPublico = Pick<Usuario, 'id' | 'nome' | 'email'>;
