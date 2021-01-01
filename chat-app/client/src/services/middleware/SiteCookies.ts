import * as Cookies from "js-cookie";

const CookieName = "Fluvio-Simple-Chat-Token";

export const getSiteToken = () => {
  return Cookies.get(CookieName);
};