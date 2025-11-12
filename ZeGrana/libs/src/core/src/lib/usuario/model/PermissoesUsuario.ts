export default interface PermissoesUsuario {
    
    // Sessão para admins
    admin: boolean;
    podeVerDashboardDeOutrosUsuarios: boolean;
    podeGerenciarUsuarios: boolean;

    // Sessão para usuários comuns
    podeEditarDashboard: boolean;
    podeAcessarLifeControl: boolean;
    podeVerRelatorios: boolean;
}