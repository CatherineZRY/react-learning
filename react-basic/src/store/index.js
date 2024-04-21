import { configureStore } from "@reduxjs/toolkit";
import conterReducer from "./modules/counterStore";
import channelReducer from "./modules/channelStore";

const store = configureStore({
  reducer: {
    counter: conterReducer,
    channel: channelReducer
  }
})

export default store