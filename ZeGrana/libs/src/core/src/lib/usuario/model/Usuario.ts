import LifeControl from "../../lifeControl/model/lifeControl";

export default interface Usuario {
    id: string;
    nome: string;
    email: string;
    senha: string;

    lifeControl: LifeControl;

    idade: number;

    // Informações financeiras

}