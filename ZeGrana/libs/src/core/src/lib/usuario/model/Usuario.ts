import Dashboard from "../../dashboard/model/Dashboard";
import PermissoesUsuario from "./PermissoesUsuario";

export default interface Usuario {
    id?: string;
    email: string;
    senha?: string;
    
    nome: string;
    idade: number;
    
    lifeControl?: {
        createdAt?: Date;
        updatedAt?: Date;
    }
    
    // cada usuário tem seu próprio dashboard, e o dashboard é quem conecta as informações bancárias do usuário
    dashboard?: Dashboard; 

    // permissões do usuário
    // permissoes: PermissoesUsuario;

    // financeiro: Financeiro;

}