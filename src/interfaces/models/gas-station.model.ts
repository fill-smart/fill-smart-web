import { IBaseModel } from "./base.model";

export interface IGasStationModel extends IBaseModel {
  name: string;
  address: string;
  purchaseRequireAuthorization: boolean;
}
