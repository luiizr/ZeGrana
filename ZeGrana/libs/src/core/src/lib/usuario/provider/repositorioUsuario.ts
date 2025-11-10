import Usuario from "../model/Usuario";

export default interface RepositorioUsuario {
    salvar(usuario: Usuario): Promise<Usuario>;
    deletar(id: string): Promise<void>;
    buscarUsuarioPorId(id: string): Promise<Usuario | null>;
    buscarUsuarioPorEmail(email: string): Promise<Usuario | null>;
}