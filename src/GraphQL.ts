export interface IQueryResult<T> {
    [queryName: string]: {
        result: T[];
        pageInfo: {
            total: number;
        };
    };
}
