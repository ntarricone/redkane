import { IFiles } from "../../interfaces/IFiles";
import { TAction } from "../types";
import produce from "immer";

const initialState: IFiles = {
  byId: {},
  order: [],
  chosenFile: {
    multimediaId: 0,
    path: "",
    title: "",
    time: "",
    type: "",
    price: 0,
    category: "",
    textArea: "",
    description: "",
    reading_time: "",
    views: 0,
    language: "",
    id: 0
  }
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
        return { ...state, chosenFile: action.payload };
      case "UNSET_FILES":
        draftState.byId = {};
        draftState.order = [];
        // draftState.selectedFileId = null;
        break;
      case "DELETE_FILE":
      delete draftState.byId[action.payload];
      const pos = draftState.order.indexOf(action.payload);
      draftState.order.splice(pos, 1);
      break;
      case "ADD_FILE":
        if (action.payload.category !== "redkaneLive"){
        const {multimediaId} = action.payload;
        draftState.byId[multimediaId] = action.payload;
        draftState.order.splice(0,0,multimediaId);
      }
        break;

      //TODO ADD AN ADD MULTIMEDIA SO WHEN THINGS GET UPLOADED THEY REFLECT IMMEDIATELY IN REDUX
      default:
        return state;
    }
  });
