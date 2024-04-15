import { configureStore } from "@reduxjs/toolkit";
import conterReducer from "./modules/counterStore";

const store = configureStore({
  reducer: {
    counter: conterReducer
  }
})

export default store