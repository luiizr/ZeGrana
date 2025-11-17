import { repositorioUsuario, Usuario } from '@ze-grana/core';
import ProvedorDados, { Filtro } from '../providers/ProvedorDados';

export default class ColecaoUsuario implements repositorioUsuario {
    constructor(private provedor: ProvedorDados) {}
    async salvar(usuario: Usuario): Promise<Usuario> {
        if (!usuario.id) {
        const dadosUsuarioSemID: Record<string, unknown> = {
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha,
            lifecontrol: usuario.lifeControl
            a: usuario.
        }
        await this.provedor.salvar('usuarios', dadosUsuarioSemID);
    }
                // ✅ Não loga dados do usuário (contém senha)
        
        // Não passa o terceiro parâmetro (id) para forçar INSERT
        await this.provedor.salvar('usuarios', dadosUsuario);
        throw new Error('Method not implemented.');
    }
    deletar(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    buscarUsuarioPorId(id: string): Promise<Usuario | null> {
        throw new Error('Method not implemented.');
    }
    buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
        throw new Error('Method not implemented.');
    }

    async RegistrarUsuario(usuario: Usuario): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async BuscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
        const filtros: Filtro[] = [{
            campo: 'email',
            operador: 'igual',
            valor: email
        }];

        return await this.provedor.buscarPrimeiro<Usuario>('usuarios', filtros);
    }

    async BuscarUsuarioPorId(id: string): Promise<Usuario | null> {
        return await this.provedor.buscarPorId<Usuario>('usuarios', id);
    }

    async CalcularKcal(usuario: Usuario): Promise<Usuario> {
        // Implementação do cálculo de Kcal aqui
        // Por agora, retorna o usuário como está
        return usuario;
    }
}