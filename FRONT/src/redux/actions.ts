import { IAccount } from "../interfaces/IAccount";
import { TAction } from "./types";


export const SetAccountAction = (account: IAccount): TAction => ({
    type: "SET_ACCOUNT",
    payload: account
  });

  export const LogoutAction = (): TAction => ({ type: "LOGOUT" });