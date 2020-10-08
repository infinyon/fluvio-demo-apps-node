import { Request, Response, NextFunction } from "express";
import { HTTP401Error } from "../common/httpErrors";
import Users from "../store/users";

//
//  Expecting authorization header
//  Header 'Authorization: Token xxxxxxxxxxxxxx' required
//
export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authValues = <Array<string>>req.headers["authorization"]?.split(" ");
  if (authValues && authValues.length > 0) {
    const token = authValues[1];
    const user = Users.getUserByToken(token);
    if (!user) {
      throw new HTTP401Error(`Invalid authorization token`);
    }
    res.locals.user = user;
  } else {
    throw new HTTP401Error("Authorization token required");
  }

  next();
};
