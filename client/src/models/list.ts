export interface ListModel<T> {
    list: Array<T>;
    skip: number;
    limit: number;
    total: number;
}