import { IBaseModel } from "./base.model";

export enum PaymentMethodsEnum {
  Cash = "cash",
  Mercadopago = "mercadopago"
}

export interface IOperationModel extends IBaseModel {
  stamp: Date;
  fuelTypeId: number;
  fuelTypeName: string;
  gasStationId: number;
  gasStationName: string;
  customerFirstName: string;
  customerLastName: string;
  customerDocumentNumber: string;
  fuelPrice: number;
  litres: number;
  operationTypeId: number;
  operationTypeName: string;
  pumpExternalId: string | null;
  exchangeSourceFuelType: string | null;
  paymentMethod: PaymentMethodsEnum | null;
  total: number;
  transactionId: string;
}
