import { IQuoteModel } from "./quote.model";
import { IInvestmentTypeModel } from "./investment-type.model";
import { IBaseModel } from "./base.model";

export enum InvestmentMovementTypeEnum {
    Sale = "SALE",
    Purchase = "PURCHASE"
}

export interface IInvestmentModel extends IBaseModel {
    investmentType: IInvestmentTypeModel;
    quote: IQuoteModel;
    ammount: number;
    movementType: InvestmentMovementTypeEnum;
    stamp: Date;
    dueDate: Date;
}
