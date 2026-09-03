import bcrypt from 'bcrypt';
export class HasherBcrypt { hash(senha: string): Promise<string> { return bcrypt.hash(senha, 12); } comparar(senha: string, hash: string): Promise<boolean> { return bcrypt.compare(senha, hash); } }
