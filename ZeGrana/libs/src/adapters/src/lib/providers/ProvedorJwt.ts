// Porta
export default interface ProvedorJwt {
    gerar(dados: string | object): string;
    obter(token: string): string | object;
}