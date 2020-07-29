export type IFilterCriteria =
    | IPropertyFilterCriterion
    | IAndFilterCriteria
    | IOrFilterCriteria;
export interface IPropertyFilterCriterion {
    property: string;
    value: { from: Date | number; to: Date | number } | any;
    type: FilterTypesEnum;
}
export interface IAndFilterCriteria {
    and: IFilterCriteria[];
}

export interface IOrFilterCriteria {
    or: IFilterCriteria[];
}

export enum FilterTypesEnum {
    Equals = "eq",
    IsNull = "null",
    IsNotNull = "not_null",
    GreatherThan = "gt",
    GreatherThanEquals = "gte",
    LowerThan = "lt",
    LowerThanEquals = "lte",
    NotEquals = "neq",
    Between = "btw",
    In = "in",
    Like = "like"
}