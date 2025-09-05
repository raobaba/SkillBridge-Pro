import moment from "moment";
import { find, trim } from "lodash";
const TOKEN_KEY = "token";

const setToken = (token) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

const getToken = () => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return token;
  }
  return "";
};

const removeToken = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(TOKEN_KEY);
  }
};

export { getToken, setToken, removeToken };
