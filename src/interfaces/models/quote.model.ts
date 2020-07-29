import { IBaseModel } from "./base.model";
import { IInvestmentTypeModel } from "./investment-type.model";

export interface IQuoteModel extends IBaseModel {
    investmentType: IInvestmentTypeModel;
    price: number;
    from: Date;
    to: Date | null;
    parentQuote: IQuoteModel;
    arsEquivalent: number;
}
