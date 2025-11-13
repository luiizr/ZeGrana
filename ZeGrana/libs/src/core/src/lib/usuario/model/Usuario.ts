import Financeiro from "../../belvo/Financeiro";
import Dashboard from "../../dashboard/model/Dashboard";
import LifeControl from "../../lifeControl/model/lifeControl";
import PermissoesUsuario from "./PermissoesUsuario";

export default interface Usuario {
    id: string;
    email: string;
    senha: string;
    
    nome: string;
    idade: number;
    
    lifeControl: LifeControl;
    
    // cada usuário tem seu próprio dashboard, e o dashboard é quem conecta as informações bancárias do usuário
    dashboard: Dashboard; 

    // permissões do usuário
    permissoes: PermissoesUsuario;

    financeiro: Financeiro;

}