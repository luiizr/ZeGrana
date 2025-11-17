import Usuario from "../../usuario/model/Usuario";

export default interface Dashboard {
    id?: string;
    usuarioId: Usuario["id"];

}