import type { CasoDeUso } from "@ze-grana/utils";
import Usuario from "../model/Usuario";
import RepositorioUsuario from "../provider/repositorioUsuario";

export default class salvarUsuario implements CasoDeUso<Usuario, void> {
    constructor(private repoUser: RepositorioUsuario) {}



    
    executar(entrada: Usuario): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}