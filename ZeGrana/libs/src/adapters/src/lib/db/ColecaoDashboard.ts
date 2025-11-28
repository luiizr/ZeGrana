
import type { RepositorioDashboard, Dashboard } from '@ze-grana/core';
import ProvedorDados from '../providers/ProvedorDados';

export default class ColecaoDashboard implements RepositorioDashboard {
    constructor(private provedor: ProvedorDados) {}
    async criar(): Promise<Dashboard["id"]> {
        const dashboard: Record<string, unknown> = {};
        const result = await this.provedor.salvar<{ id?: string }>('dashboards', dashboard);
        return result?.id;
    }
}
