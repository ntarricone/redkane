import { combineReducers } from "redux";
import { IStore } from "../../interfaces/IStore";
import account from "./accountReducer";

export default combineReducers<IStore>({
  account
  });