import { IBaseModel } from "./base.model";
import { IFuelTypeModel } from "./fuel-type.model";

export interface IFuelPriceModel extends IBaseModel {
    fuelType: IFuelTypeModel;
    price: number;
    from: Date;
    to: Date | null;
}
