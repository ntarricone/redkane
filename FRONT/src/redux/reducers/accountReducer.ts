import { IAccount } from "../../interfaces/IAccount";
import { TAction } from "../types";
import produce from "immer";

type TState = IAccount | null;

const initialState: TState = null;

export default (state: TState = initialState, action: TAction): TState =>
  produce(state, draftState => {
    switch (action.type) {
      case "SET_ACCOUNT":
        return action.payload;
      case "LOGOUT":
        return initialState;
      default:
        return state;
    }
  });

