import { IAccount } from "../interfaces/IAccount";


interface ISetAccountAction{
    type: "SET_ACCOUNT";
    payload: IAccount
}

interface ILogoutAction {
  type: "LOGOUT";
}

interface ISetBannerAction{
  type: "SET_BANNER";
  payload: string
}

interface ISetAvatarAction{
  type: "SET_AVATAR";
  payload: string
}

export type TAction =
  | ISetAccountAction
  | ILogoutAction
  | ISetBannerAction
  | ISetAvatarAction;