import { IGasStationModel } from "./gas-station.model";
import { IBaseModel } from "./base.model";

export interface IGasStationAdministrator extends IBaseModel {
    name: string;
    gasStation: IGasStationModel;
}

