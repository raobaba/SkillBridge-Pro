/**
 * --------------------------------------------------------
 * File        : fetchFromApiServer.js
 * Description : Central utility for making HTTP requests to the API server
 *               using Axios with automatic header and token management.
 * Authors     : Developer team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Supports GET, POST, DELETE, PUT, PATCH, and MULTIPART requests.
 * - Automatically includes authorization tokens from storage.
 * - Uses a 10-minute timeout by default.
 */


import axios from "axios";
import { getToken } from "../utils";

const fetchFromApiServer = (requestType, url, data, options, Authorization) => {
  return fetchApiWrapper(url, requestType, data, options, Authorization);
};

function getHeaderConfig(requestType, options, Authorization) {
  const token = getToken();

  const config = {
    headers: {
      "Content-Type":
      requestType === "MULTIPART" || requestType === "MULTIPART_PUT"
          ? "multipart/form-data"
          : "application/json",
      authorization: Authorization || "Bearer " + (token || ""),
      Accept: "*/*",
    },
    params: { ...options },
    timeout: 60 * 10 * 1000,
  };
  return config;
}
const fetchApiWrapper = (
  uri,
  requestType,
  data,
  options = {},
  Authorization,
) => {
  const url = import.meta.env.VITE_APP_API_URL + uri;
  const config = getHeaderConfig(requestType, options, Authorization);
  if (requestType === "GET") {
    return axios({ url, method: "get", ...config });
  } else if (requestType === "POST") {
    return axios({ url, method: "post", data, ...config });
  } else if (requestType === "DELETE") {
    return axios({ url, method: "delete", data, ...config });
  } else if (requestType === "PUT") {
    return axios({ url, method: "put", data, ...config });
  } else if (requestType === "PATCH") {
    return axios({ url, method: "patch", data, ...config });
  } else if (requestType === "MULTIPART") {
    return axios({ url, method: "post", data, ...config });
  } else if (requestType === "MULTIPART_PUT") {
    return axios({ url, method: "put", data, ...config });
  } else if (requestType === "JSON") {
    return axios.get(url);
  }
};

export default fetchFromApiServer;
