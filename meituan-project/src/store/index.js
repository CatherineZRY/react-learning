import { configureStore } from '@reduxjs/toolkit';
import menuListReducer from './modules/menuListStore'

const store = configureStore({
  reducer: {
    menu: menuListReducer,
  }
})

export default store