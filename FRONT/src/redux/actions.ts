import { IAccount } from "../interfaces/IAccount";
import { TAction } from "./types";

export const SetAccountAction = (account: IAccount): TAction => ({
  type: "SET_ACCOUNT",
  payload: account
});

export const LogoutAction = (): TAction => ({ type: "LOGOUT" });

export const SetBannerAction = (banner: string): TAction => ({
  type: "SET_BANNER",
  payload: banner
})

export const SetAvatarAction = (avatar: string): TAction => ({
  type: "SET_AVATAR",
  payload: avatar
})
