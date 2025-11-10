import { v4 as uuid } from 'uuid';

export default class Id {
    static gerarIdHash(): string {
        return uuid()
    }
}