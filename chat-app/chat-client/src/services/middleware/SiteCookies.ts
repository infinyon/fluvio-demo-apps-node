import * as Cookies from "js-cookie";

const CookieName = "Flv-Chat";
const Expires = 365;

export const setSiteToken = (
  name: string,
  token: string,
  colorCode: string
) => {
  let siteCookie = _getSiteCookie();
  if (siteCookie) {
    siteCookie.token = token;
    siteCookie.name = name;
    siteCookie.colorCode = colorCode;
  } else {
    siteCookie = {
      token: token,
      name: name,
      colorCode: colorCode,
    };
  }
  _setSiteCookie(siteCookie);
};

export const setChannel = (channel: string) => {
  let siteCookie = _getSiteCookie();
  if (siteCookie) {
    siteCookie.channel = channel;
  } else {
    siteCookie = {
      channel: channel,
    };
  }
  _setSiteCookie(siteCookie);
};

export const getSiteToken = () => {
  let siteCookie = _getSiteCookie();
  return siteCookie ? siteCookie.token : undefined;
};

export const getUserName = () => {
  let siteCookie = _getSiteCookie();
  return siteCookie ? siteCookie.name : undefined;
};

export const getColorCode = () => {
  let siteCookie = _getSiteCookie();
  return siteCookie ? siteCookie.colorCode : undefined;
};

export const getChannel = () => {
  let siteCookie = _getSiteCookie();
  return siteCookie ? siteCookie.channel : undefined;
};

export const clearSiteCookie = () => {
  Cookies.remove(CookieName, { path: "/" });
};

const _getSiteCookie = () => {
  return Cookies.getJSON(CookieName);
};

const _setSiteCookie = (value: any) => {
  Cookies.set(CookieName, value, { path: "/", expires: Expires });
};
