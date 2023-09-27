import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

export type MethodType = "get" | "post" | "patch" | "delete";

export type BaseClientType = {
  method: MethodType;
  url: string;
  token?: string;
  data?: any;
  options?: any;
};

export type BaseClientWithoutAuthType = Omit<BaseClientType, "token">;

const options = {
  ignoreHeaders: true,
};

const baseClient = applyCaseMiddleware(
  axios.create({
    baseURL: "http://localhost:8000/api/",
  }),
  options
);

export const BaseClientWithAuth = (props: BaseClientType) => {
  const { method, url, data, options, token } = props;
  return baseClient.request({
    headers: { "Content-Type": options, authorization: `Bearer ${token}` },
    withCredentials: true,
    method,
    url,
    data,
  });
};

export const BaseClientWithoutAuth = (props: BaseClientWithoutAuthType) => {
  const { method, url, data, options } = props;
  return baseClient.request({
    headers: { "Content-Type": options },
    withCredentials: true,
    method,
    url,
    data,
  });
};
