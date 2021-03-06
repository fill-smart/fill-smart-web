import { IPumpModel } from './pump.model';
import { IFuelPriceModel } from './fuel-price.model';
import { IWalletModel } from './wallet.model';
import { IBaseModel } from "./base.model";
import { IFuelTypeModel } from './fuel-type.model';


export interface IRefuelModel extends IBaseModel {
    stamp: Date;
    wallet: IWalletModel;
    fuelType: IFuelTypeModel;
    fuelPrice: IFuelPriceModel;
    litres: number;
    pump:IPumpModel
}
