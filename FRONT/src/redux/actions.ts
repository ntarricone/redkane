import { IAccount } from "../interfaces/IAccount";
import { TAction } from "./types";
import { IFile } from "../interfaces/IFile";

export const SetAccountAction = (account: IAccount): TAction => ({
  type: "SET_ACCOUNT",
  payload: account
});

export const LogoutAction = (): TAction => ({ type: "LOGOUT" });

export const SetBannerAction = (banner: string): TAction => ({
  type: "SET_BANNER",
  payload: banner
});

export const SetAvatarAction = (avatar: string): TAction => ({
  type: "SET_AVATAR",
  payload: avatar
});

//working with file

export const SetFilesAction = (files: IFile[]): TAction => ({
  type: "SET_FILES",
  payload: files
});
 
export const SetChosenFileAction = (file: IFile): TAction => ({
  type: "SET_CHOSEN_FILE",
  payload: file
});

export const UnsetFilesAction = (): TAction => ({
  type: "UNSET_FILES"
});
