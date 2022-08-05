import { Request } from "express";
import { IUser } from "@interfaces/user.interface";

export interface TokenPayload {
  user: IUser;
}

export interface RequestWithUser extends Request {
  user: IUser;
}
