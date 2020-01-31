import { IAccount } from "../../interfaces/IAccount";
import { TAction } from "../types";
import produce from "immer";

const initialState: IAccount = {
  name: "",
  surname: "",
  profession: "",
  password: "",
  token: "",
  avatar: "",
  id: null,
  email: "",
  isAdmin: false,
  banner: "",
  about_me: "",
  youtube: "",
  linkedin: ""
};

export default (state: IAccount = initialState, action: TAction): IAccount =>
  produce(state, draftState => {
    switch (action.type) {
      case "SET_ACCOUNT":
        return action.payload;
      case "LOGOUT":
        return initialState;
      case "SET_BANNER":
        return { ...state, banner: action.payload };
      case "SET_AVATAR":
        return { ...state, avatar: action.payload };
      default:
        return state;
    }
  });
