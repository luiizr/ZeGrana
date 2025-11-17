import type { CasoDeUso } from "@ze-grana/utils";
import RepositorioDashboard from "../provider/repositorioDashboard";

export default class criarDashboard implements CasoDeUso<'', void> {
    constructor(
        private repoDashboard: RepositorioDashboard
    ) {}    

    async executar(): Promise<void> {
        await this.repoDashboard.criar();
    }
}