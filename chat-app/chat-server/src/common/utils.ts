import * as bcrypt from "bcryptjs";

export type KV = { [key: string]: any };

export const getDateTime = () => {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, -1);
};

export const getHashedPassword = (clearPass: string) => {
  const pass = bcrypt.hashSync(clearPass, 8);
  return pass;
};

export const comparePasswords = (hashedPass: string, clearPass: string) => {
  return bcrypt.compareSync(clearPass, hashedPass);
};

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const isPositiveInteger = function (s: string) {
  return /^\+?[1-9][\d]*$/.test(s);
};

export const isValidEmail = function (email: string) {
  var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailReg.test(email);
};

export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const isValidUUID = (id: string) => {
  var pattern = new RegExp(
    /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i
  );
  return pattern.test(id);
};

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export const randomColorCode = () => {
  const colors = [
    "red",
    "pink",
    "purple",
    "deepPurple",
    "indigo",
    "blue",
    "lightBlue",
    "cyan",
    "teal",
    "green",
    "lightGreen",
    "lime",
    "yellow",
    "amber",
    "orange",
    "deepOrange",
    "brown",
  ];
  const weights = [100, 200, 300, 400, 500];

  let randomWeight = weights[getRandomInt(0, weights.length)];
  let randomColor = colors[getRandomInt(0, colors.length)];
  return `${randomColor}_${randomWeight}`;
};
