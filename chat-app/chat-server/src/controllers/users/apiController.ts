import { Request, Response } from "express";
import { HTTP404Error } from "../../common/httpErrors";
import Users from "../../store/users";

// =====================================
// API Controller
// =====================================

export const registerUser = async ({ body }: Request, res: Response) => {
  const name = body.name;

  if (Users.hasUser(name)) {
    throw new HTTP404Error(`User '${name}' is already registered.`);
  }

  const colorCode = Users.addUser(body);

  res.status(200).send({ params: { colorCode: colorCode } });
};

export const loginUser = async ({ body }: Request, res: Response) => {
  const name = body.name;
  const password = body.password;
  var user = Users.getUser(name);

  if (!user) {
    throw new HTTP404Error(`User '${name}' not registered.`);
  }

  if (!user.isValidPassword(password)) {
    throw new HTTP404Error(`Invalid password.`);
  }

  let token = user.generateToken();

  res.status(200).send({
    token: token,
    colorCode: user.colorCode,
  });
};

export const resetPassword = async ({ body }: Request, res: Response) => {
  let name = body.name;
  let newPassword = body.password;
  let user = Users.getUser(name);

  if (!user) {
    throw new HTTP404Error(`User '${name}' not registered.`);
  }

  user.updatePassword(newPassword);

  res.status(200).send({ result: "ok" });
};

export const logoutUser = async (_: Request, res: Response) => {
  var user = res.locals.user;

  user.clearToken();

  res.status(200).send({ result: "ok" });
};

export const unregisterUser = async (_: Request, res: Response) => {
  var user = res.locals.user;

  Users.removeUser(user.name);

  res.status(200).send({ result: "ok" });
};

export const getUsers = async (_: Request, res: Response) => {
  let users = Users.getUsers();

  console.log(Users);

  res.status(200).send(users);
};
