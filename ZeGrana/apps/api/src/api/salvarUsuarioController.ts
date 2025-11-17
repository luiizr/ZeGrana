import { Express } from "express";
import { salvarUsuario } from "@ze-grana/core";
import { ProvedorCriptografia } from "@ze-grana/adapters";

export default class SalvarUsuarioController {
    constructor(
        servidor: Express,
        provedorCriptografia: ProvedorCriptografia,
        cdu: salvarUsuario
    ){
        servidor.post('/api/salvarUsuario', async (req, res) => {
            if (!req.body.Id){
            try {
                const senhaCripto = await provedorCriptografia.criptografar(req.body.senha);
                await cdu.executar({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: senhaCripto,
                    idade: req.body.idade,
                    lifeControl: req.body.lifeControl,
                    dashboard: req.body.dashboard
                })
                res.status(200).send("Usuário salvo com sucesso.");
            }catch (error) {
                res.status(500).send(error);
            }
        }
        else {
            try {
            await cdu.executar({
                id: req.body.id,
                nome: req.body.nome,
                email: req.body.email,
                idade: req.body.idade,
                lifeControl: req.body.lifeControl,
                dashboard: req.body.dashboard
            })
            res.status(200).send("Usuário atualizado com sucesso.");
        }catch (error) {
            res.status(500).send(error);
        }
    }
});
}
}