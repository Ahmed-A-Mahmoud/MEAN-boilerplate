import { IPlace } from "@interfaces/place.interface";

export interface IUser {
  id: string;
  email: string;
  password?: string;
  name: string;
  places?: IPlace[];
}
