import Dashboard from "../model/Dashboard";

export default interface RepositorioDashboard {
    criar(): Promise<Dashboard["id"]>;
}