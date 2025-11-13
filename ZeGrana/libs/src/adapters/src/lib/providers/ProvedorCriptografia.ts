// Interface para provedor de criptografia
// Esta interface deve ser implementada por adapters externos
export default interface ProvedorCriptografia {
    criptografar(senha: string): string;
    comparar(senha: string, senhaCriptografada: string): boolean;
}