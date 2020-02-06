import { IAccount } from "../interfaces/IAccount";
import { IFile } from "../interfaces/IFile";


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


//working with files
interface ISetFilesAction {
  type: "SET_FILES";
  payload: IFile[];
}

interface IUnsetFilesAction {
  type: "UNSET_FILES";
}



export type TAction =
  | ISetAccountAction
  | ILogoutAction
  | ISetBannerAction
  | ISetAvatarAction
  | ISetFilesAction
  | IUnsetFilesAction;