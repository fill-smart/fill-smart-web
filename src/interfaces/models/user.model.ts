import { ISeller } from "./seller.model";
import { IBaseModel } from "./base.model";
import { RolesEnum } from "../../contexts/security.context";
import { IGasStationAdministrator } from "./gas-station-administrator.model";

export interface IUserModel extends IBaseModel {
    username: string;
    roles: Array<ISimpleRole>;
    seller?: ISeller;
    gasStationAdministrator?: IGasStationAdministrator;
}

export interface ISimpleRole {
    name: RolesEnum;
}
