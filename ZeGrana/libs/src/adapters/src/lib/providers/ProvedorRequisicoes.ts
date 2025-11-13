export default interface RequisicoesHttp {
    post<T>(url: string, data: any): Promise<T>
    get<T>(url: string): Promise<T>
    put<T>(url: string, data: any): Promise<T>
    delete<T>(url: string): Promise<T>
}