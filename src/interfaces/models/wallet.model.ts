import { IBaseModel } from "./base.model";
import { ICustomerModel } from "./customer.model";
import { IFuelTypeModel } from "./fuel-type.model";

export interface IWalletModel extends IBaseModel {
  customer: ICustomerModel;
  fuelType: IFuelTypeModel;
  litres: number;
  availableLitres: number;
}
