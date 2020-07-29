import { IPurchaseModel } from "./purchase.model";
import { IShopPurchaseModel } from "./shop-purchase.model";
import { ICashWithdrawalModel } from "./cash-withdrawal.model";

import { IBaseModel } from "./base.model";
import { IRefuelModel } from "./refuel.model";

export interface IAuthorizationModel extends IBaseModel {
    refuel?: IRefuelModel;
    cashWithdrawal?: ICashWithdrawalModel;
    shopPurchase?: IShopPurchaseModel;
    purchase?: IPurchaseModel;
}
