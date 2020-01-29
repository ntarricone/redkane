import { API_URL } from "./constants";
import { IAccount } from "./interfaces/IAccount";
import { ITokenPayload } from "./interfaces/ITokenPayload";
import { decode } from "jsonwebtoken";

export const myFetch = async ({
  method = "GET",
  path,
  json,
  formData,
  token
}: {
  path: string;
  method?: "GET" | "POST" | "DELETE";
  json?: Object;
  formData?: FormData;
  token?: string;
}) => {
  
  let headers = new Headers();
  let body = undefined;
  if (json) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  } else if (formData) {
    body = formData;
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  console.log("response")
  const response = await fetch(API_URL + path, {
    method,
    headers,
    body
  });
  try {
    const json = await response.json();
    return json;
  } catch {
    return null;
  }
};

export const generateAccountFromToken = (token: string, avatar?: any): IAccount => {
  const { id, email, isAdmin } = decode(token) as ITokenPayload;
  return { token, id, email, isAdmin, avatar };
};


