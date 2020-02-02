import { IAccount } from "./IAccount";
import { IFiles } from "./IFiles";

export interface IStore{
    account: IAccount;
    files: IFiles;
}