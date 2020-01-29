import { IAccount } from "../interfaces/IAccount";


interface ISetAccountAction{
    type: "SET_ACCOUNT";
    payload: IAccount
}

interface ILogoutAction {
  type: "LOGOUT";
}

export type TAction =
  | ISetAccountAction
  | ILogoutAction;