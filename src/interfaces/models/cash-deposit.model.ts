import { IGasStationModel } from "./gas-station.model";
import { IBaseModel } from "./base.model";

export interface ICashDepositModel extends IBaseModel {
  amount: number;
  gasStation: IGasStationModel;
  stamp: Date;
  receipt: string;
}
