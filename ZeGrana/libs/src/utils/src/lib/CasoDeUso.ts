export interface CasoDeUso<E, S> { // E = Entrada || S = Saida
    executar(entrada: E): Promise<S>
}