import { combineReducers } from "redux";

import LayoutReducer from "./layouts/reducer";
import loaderReducer from "./loader/loaderSlice"
import uiReducer from "./pageResizer/uiSlice"

const rootReducer = combineReducers({
    Layout: LayoutReducer,
    loader: loaderReducer,
    ui: uiReducer,
});

export default rootReducer;