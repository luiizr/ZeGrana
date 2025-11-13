import jwt from 'jsonwebtoken';
import ProvedorJwt from '../../../../adapters/src/providers/ProvedorJwt';

export default class Jwt implements ProvedorJwt {
    constructor(private segredo: string) {}
    gerar(dados: string | object): string {
        return jwt.sign(dados, this.segredo, { expiresIn: '1d' });
    }

    obter(token: string): string | object {
        return jwt.verify(token, this.segredo)
    }
}