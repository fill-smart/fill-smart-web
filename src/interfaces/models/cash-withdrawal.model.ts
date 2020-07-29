import { IFuelPriceModel } from "./fuel-price.model";
import { IWalletModel } from "./wallet.model";
import { IBaseModel } from "./base.model";
import { IFuelTypeModel } from "./fuel-type.model";

export interface ICashWithdrawalModel extends IBaseModel {
    stamp: Date;
    wallet: IWalletModel;
    fuelType: IFuelTypeModel;
    fuelPrice: IFuelPriceModel;
    litres: number;
}
