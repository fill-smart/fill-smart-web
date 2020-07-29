import { IBaseModel } from "./base.model";
import { IFuelTypeModel } from "./fuel-type.model";
import { IGasStationModel } from "./gas-station.model";

export interface IGasTankModel extends IBaseModel {
    externalId: string;
    fuelType: IFuelTypeModel;
    litres: number;
    gasStation: IGasStationModel;
}
