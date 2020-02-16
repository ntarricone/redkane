import { API_URL } from "./constants";
import { IAccount } from "./interfaces/IAccount";
import { decode } from "jsonwebtoken";


//function to fetch information, similar to axios
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



export const generateAccountFromToken = ({
  name,
  surname,
  profession,
  token,
  avatar,
  banner,
  about_me,
  youtube,
  linkedin,
  isCreator
}:{
  name: string;
  surname: string;  
  token: string;
  avatar?: any ;
  profession?: any;
  banner?: string | undefined;
  about_me?: any;
  youtube: string;
  linkedin: string;
  isCreator: boolean;
}): IAccount => {
  const { id, email, isAdmin }: any = decode(token);
  return { token, id, email, isAdmin, name, avatar, banner, surname, profession, about_me, youtube, linkedin, isCreator };
};

//GET YOUTUBE ID
export const getYoutubeId = (path: string) =>  {
  if (path.includes("watch")) {
    return path.split("v=")[1];
  }else if (path.includes("embed")){
    return path.split('d/')[1]
  }else if (path.includes('youtu.be')){
    return path.split('e/')[1]
  }else{
    return path
  }
}


