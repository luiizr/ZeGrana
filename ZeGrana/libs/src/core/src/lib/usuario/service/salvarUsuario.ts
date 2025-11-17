import type { CasoDeUso } from "@ze-grana/utils";
import Usuario from "../model/Usuario";
import RepositorioUsuario from "../provider/repositorioUsuario";
import RepositorioDashboard from "../../dashboard/provider/repositorioDashboard";

export default class salvarUsuario implements CasoDeUso<Usuario, void> {
    constructor(
        private repoUser: RepositorioUsuario,
        private repoDashboard: RepositorioDashboard
    ) {}
    
    async executar(usuario: Usuario): Promise<void> {

        if(!usuario.id){
            try {
            console.log('Usuario sem ID, criando novo usuário e novo dashboard')
            const dashboardId = await this.repoDashboard.criarDashboard()
            const novoUsuario: Usuario = {
                // id: usuario.id,
                email: usuario.email,
                senha: usuario.senha,
                nome: usuario.nome,
                idade: usuario.idade,
                // lifeControl: usuario.lifeControl,
                dashboard: dashboardId
            };
            console.log('Mandando para o banco de dados')
            await this.repoUser.salvar(novoUsuario);

        } catch (error) {
            throw new Error("Erro ao salvar usuário: " + error);
        }
    } else {
        // Verificar se esse ID realmente existe
        const usuarioExistente = await this.repoUser.buscarUsuarioPorEmail(usuario.email);
        if (!usuarioExistente) {
            throw new Error("Usuário com o ID fornecido não existe.");
        }
        else {
        try {
            const novoUsuario: Usuario = {
                id: usuario.id,
                email: usuario.email,
                senha: usuario.senha,
                nome: usuario.nome,
                idade: usuario.idade,
                lifeControl: usuario.lifeControl,
                // dashboard: usuario.dashboard
            };

        } catch (error) {
            throw new Error("Erro ao atualizar usuário: " + error);
        }
    }
    }
    }
}