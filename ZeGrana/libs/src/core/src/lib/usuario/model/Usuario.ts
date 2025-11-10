import LifeControl from "../../lifeControl/model/lifeControl";

export default interface Usuario {
    id: string;
    email: string;
    senha: string;
    
    nome: string;
    idade: number;
    
    lifeControl: LifeControl;
    
    dashboard: string; // cada usuário tem seu próprio dashboard, e o dashboard é quem conecta as informações bancárias do usuário

    // Informações financeiras

}