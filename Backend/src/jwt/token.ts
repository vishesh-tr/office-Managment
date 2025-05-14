import jwt from "jsonwebtoken";
import { Response } from "express";
import User from "../models/user.model";

export const generateTokenAndSaveInCookies = async (userId: string, res: Response): Promise<string> => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "10d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  await User.findByIdAndUpdate(userId, { token });
  return token;
};