import { IFuelPriceModel } from "./fuel-price.model";
import { IWalletModel } from "./wallet.model";
import { IBaseModel } from "./base.model";
import { IFuelTypeModel } from "./fuel-type.model";
import { ICashWithdrawalModel } from "./cash-withdrawal.model";
import { ICustomerModel } from "./customer.model";
import { IUserModel } from "./user.model";

export interface ITransferWithdrawalModel extends IBaseModel {
    stamp: Date;
    code: string;
    accountType: string;
    authorized: boolean;
    withdrawal: ICashWithdrawalModel;
    customer: ICustomerModel;
    authorizer: IUserModel;
}
