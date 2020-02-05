import { IFiles } from "../../interfaces/IFiles";
import { TAction } from "../types";
import produce from "immer";
import { IFile } from "../../interfaces/IFile";

const initialState: IFiles = {
    byId: {},
    order: [],
    chosenFile: {  
      multimediaId: 0,
      path: "",
      title:"",
      time: "",
      type: "",
      price: 0,
      category: "",
      textArea: "",
      description:"",
      reading_time:"",
      views: 0,
      language: "",
      id: 0}
  };

  
export default (state = initialState, action: TAction) =>
produce(state, draftState => {
  switch (action.type) {
    case "SET_FILES":
      const files = action.payload;
      draftState.byId = {};
      draftState.order = [];
      files.forEach(file => {
        draftState.byId[file.multimediaId] = file;
        draftState.order.push(file.multimediaId);
      });
      break;
      case "SET_CHOSEN_FILE":
      return {...state, chosenFile: action.payload}      
    
    default:
      return state;
  }
});