import type { CasoDeUso } from "@ze-grana/utils";
import Usuario from "../model/Usuario";
import RepositorioUsuario from "../provider/repositorioUsuario";

export default class salvarUsuario implements CasoDeUso<Usuario, void> {
    constructor(
        private repoUser: RepositorioUsuario
    ) {}
    
    async executar(usuario: Usuario): Promise<void> {
        // validação sem expor senha em logs
        if (!usuario.senha) {
            console.error("Tentativa de salvar usuário sem senha:", {
                id: usuario.id,
                email: usuario.email,
            });
        
        const verificarUsuarioExistente = await this.repoUser.buscarUsuarioPorEmail(usuario.email)
            if (verificarUsuarioExistente) {
                throw new Error("Usuário com este email já existe.");
            }

        const novoUsuario: Usuario = {
            id: usuario.id,
            email: usuario.email,
            senha: usuario.senha,
            nome: usuario.nome,
            idade: usuario.idade,
            lifeControl: usuario.lifeControl,
            dashboard: usuario.dashboard
        };

        await this.repoUser.salvar(novoUsuario);
    }
}
}