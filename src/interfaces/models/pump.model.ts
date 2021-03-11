import { IBaseModel } from "./base.model";
import { IGasStationModel } from "./gas-station.model";

export interface IPumpModel extends IBaseModel {
    gasStation: IGasStationModel;
    externalId: string;
}
