import { ITokenPayload } from "./ITokenPayload";

export interface IAccount /*extends ITokenPayload*/{
    name?: string;
    surname?: string;
    profession?: string;
    password?: string;
    token?: string;
    avatar?: string ;
    id?: number | null;
    email?: string;
    isAdmin?: boolean;
    banner?: string | undefined;
    about_me: string;
}