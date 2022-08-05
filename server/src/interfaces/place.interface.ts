import { IUser } from "@interfaces/user.interface";

export interface IPlace {
  id: string;
  title: string;
  description: string;
  address: string;
  creator: IUser;
}
