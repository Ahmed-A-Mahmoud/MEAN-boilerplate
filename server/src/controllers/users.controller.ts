import config from "config";
import HttpError from "@exceptions/httpError";
import { TokenPayload } from "@interfaces/auth.interface";
import { User } from "@models/user.model";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  let users: any[];
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Fetching users failed, please try again later.", 500);
    return next(error);
  }
  res.json(users);
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  let existingUser: any;
  try {
    existingUser = await User.findOne({ email: email.toLowerCase() });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again later.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User exists already, please login instead.", 422);
    return next(error);
  }

  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user, please try again.", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again later.", 500);
    return next(error);
  }

  let token: string;
  const tokenPayload: TokenPayload = {
    user: {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
    },
  };
  try {
    token = jwt.sign(tokenPayload, config.get("secretKey"), {
      expiresIn: "1h",
    });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again later.", 500);
    return next(error);
  }

  res.status(201).json({ token: token });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  let existingUser: any;

  try {
    existingUser = await User.findOne({ email: email.toLowerCase() });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again later.", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Invalid credentials, could not log you in.", 403);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Could not log you in, please check your credentials and try again.", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials, could not log you in.", 403);
    return next(error);
  }

  let token: string;
  const tokenPayload: TokenPayload = {
    user: {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
    },
  };
  try {
    token = jwt.sign(tokenPayload, config.get("secretKey"), {
      expiresIn: "1h",
    });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again later.", 500);
    return next(error);
  }

  res.json({ userId: existingUser.id, token: token });
};

export default { getUsers, signup, login };
