import { RequestWithUser } from "@interfaces/auth.interface";
import { IUser } from "@interfaces/user.interface";
import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import config from "config";

import HttpError from "../exceptions/httpError";

export default (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = verify(token, config.get("secretKey"));
    req.user = decodedToken as IUser;
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};
