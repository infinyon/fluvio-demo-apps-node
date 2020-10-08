import { Request, Response, NextFunction } from "express";
import { HTTP401Error } from "../common/httpErrors";

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (!user.isAdmin()) {
    throw new HTTP401Error("Insufficient privileges");
  }

  next();
};
