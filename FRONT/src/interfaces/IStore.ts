import { IAccount } from "./IAccount";
import { IFiles } from "./IFiles";
import { IFile } from "./IFile";

export interface IStore{
    account: IAccount;
    files: IFiles;
}