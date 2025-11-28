import { Express } from "express";
import type { ProvedorCriptografia } from "@ze-grana/adapters";
import type { repositorioUsuario } from "@ze-grana/core";
import jwt from "jsonwebtoken";

export default class LoginController {
    constructor(
        servidor: Express,
        provedorCriptografia: ProvedorCriptografia,
        repoUsuario: repositorioUsuario
    ){
        servidor.post('/api/login', async (req, res) => {
            const { email, senha } = req.body;
            try {
                const usuario = await repoUsuario.buscarUsuarioPorEmail(email);
                if (!usuario) {
                    return res.status(401).json({ erro: 'Usuário não encontrado' });
                }
                const senhaOk = provedorCriptografia.comparar(senha, usuario.senha);
                if (!senhaOk) {
                    return res.status(401).json({ erro: 'Senha inválida' });
                }
                // Gera token JWT
                const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET || 'segredo', { expiresIn: '1d' });
                res.json({ token, usuario: { id: usuario.id, email: usuario.email, nome: usuario.nome } });
            } catch (error) {
                res.status(500).json({ erro: 'Erro no login', detalhes: error });
            }
        });
    }
}
