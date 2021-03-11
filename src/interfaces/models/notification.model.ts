import { IBaseModel } from "./base.model";

export interface INotificationModel extends IBaseModel {
  title: string;
  text: string;
}
