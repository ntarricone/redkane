import { IFiles } from "../../interfaces/IFiles";
import { TAction } from "../types";
import produce from "immer";

const initialState: IFiles = {
    byId: {},
    order: [],
    selectedFileId: null
  };

  
export default (state = initialState, action: TAction) =>
produce(state, draftState => {
  switch (action.type) {
    case "SET_FILES":
      const files = action.payload;
      console.log(files)
      draftState.byId = {};
      draftState.order = [];
      draftState.selectedFileId = null;
      files.forEach(file => {
        draftState.byId[file.multimediaId] = file;
        draftState.order.push(file.multimediaId);
      });
      break;
      case "UNSET_FILES":
        draftState.byId = {};
        draftState.order = [];
        draftState.selectedFileId = null;
        break;
    
    default:
      return state;
  }
});