import { IBaseModel } from "./base.model";
import { IUserModel } from "./user.model";

export interface ICustomerModel extends IBaseModel {
    firstName: string;
    documentNumber: string;
    lastName: string;
    born: Date;
    phone: string;
    email: string;
    user: IUserModel;
    cbu: string;
    cbuAlias: string;
    mercadopagoAccount: string;
}
