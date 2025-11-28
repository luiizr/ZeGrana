import { repositorioUsuario, Usuario } from '@ze-grana/core';
import ProvedorDados, { Filtro } from '../providers/ProvedorDados';

export default class ColecaoUsuario implements repositorioUsuario {
    constructor(private provedor: ProvedorDados) {}

    async salvar(usuario: Usuario): Promise<Usuario> {
        const dados: Record<string, unknown> = {
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha,
            idade: usuario.idade,
            lifecontrol: usuario.lifeControl,
            dashboard: usuario.dashboard
        };

        if (usuario.id) {
            const result = await this.provedor.salvar<Usuario>('usuarios', dados, usuario.id);
            return result as Usuario;
        }

        const result = await this.provedor.salvar<Usuario>('usuarios', dados);
        return result as Usuario;
    }

    async deletar(id: string): Promise<void> {
        await this.provedor.excluir('usuarios', id);
    }

    async buscarUsuarioPorId(id: string): Promise<Usuario | null> {
        return await this.provedor.buscarPorId<Usuario>('usuarios', id);
    }

    async buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
        const filtros: Filtro[] = [
            { campo: 'email', operador: 'igual', valor: email }
        ];
        return await this.provedor.buscarPrimeiro<Usuario>('usuarios', filtros);
    }
}