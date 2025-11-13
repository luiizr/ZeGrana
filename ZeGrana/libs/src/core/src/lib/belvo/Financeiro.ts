import Usuario from "../usuario/model/Usuario";

export default interface Financeiro {
    Id: string;
    UsuarioId: Usuario['id'];

    
}