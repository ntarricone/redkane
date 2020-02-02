import { combineReducers } from "redux";
import { IStore } from "../../interfaces/IStore";
import account from "./accountReducer";
import files from "./filesReducer";

export default combineReducers<IStore>({
  account,
  files
  });