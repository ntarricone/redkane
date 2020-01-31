import { API_URL } from "./constants";
import { IAccount } from "./interfaces/IAccount";
import { decode } from "jsonwebtoken";

export const myFetch = async ({
  method = "GET",
  path,
  json,
  formData,
  token
}: {
  path: string;
  method?: "GET" | "POST" | "DELETE" | "PUT";
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
    console.log("esta bienn")
    const json = await response.json();
    return json;
  } catch {
    console.log("eroooooooooorrrr")
    return null;
  }
};



export const generateAccountFromToken = ({
  name,
  surname,
  profession,
  password,
  token,
  avatar,
  banner,
  about_me
}:{
  name: string;
  surname: string;  
  password: string;
  token: string;
  avatar?: any ;
  profession?: any;
  banner?: string | undefined;
  about_me?: any;
}): IAccount => {
  const { id, email, isAdmin }: any = decode(token);
  return { token, id, email, isAdmin, name, avatar, banner, surname, profession, password, about_me };
};


