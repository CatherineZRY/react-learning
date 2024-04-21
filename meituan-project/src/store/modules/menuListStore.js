import { createSlice } from "@reduxjs/toolkit"
import axiox from 'axios'
import { DOMAIN } from "../../App";

const menuListStore = createSlice({
  // store的名称
  name: 'menu',
  // 初始状态数据
  initialState: {
    menuList: [],
    activeIndex: 0, // 菜单激活下标值
    cartList: []
  },
  // 修改数据的方法
  reducers: {
    setMenuList(state, action) {
      state.menuList = [].concat(action.payload);
    },
    setActiveIndex(state, action) {
      state.activeIndex = action.payload
    },
    setCartList(state, action) {
      state.cartList = [].concat(action.payload);
    },
    // action的参数是一个完整的菜品
    addCartList(state, action) {
      const curCartList = [].concat(state.cartList)
      const newFood = { ...action.payload };
      let hasExistedFood = curCartList.find((food) => food.id === newFood.id);
      if (hasExistedFood) {
        hasExistedFood.count++;
      } else {
        newFood['count'] = 1;
        curCartList.push(newFood);
        hasExistedFood = newFood;
      }
      state.cartList = curCartList;
      state.menuList = state.menuList.map((foodType) => ({
        ...foodType,
        foods: foodType.foods.map((food) => ({
          ...food,
          count: food.id === hasExistedFood.id ? hasExistedFood.count : (food.count || 0)
        }))
      }))
    },
    // action的参数是一个完整的菜品
    reduceCartList(state, action) {
      const curCartList = [].concat(state.cartList)
      const curFood = { ...action.payload };
      let hasExistedFood = curCartList.find((food) => food.id === curFood.id);
      hasExistedFood.count--;
      state.cartList = curCartList;
      state.menuList = state.menuList.map((foodType) => ({
        ...foodType,
        foods: foodType.foods.map((food) => ({
          ...food,
          count: food.id === hasExistedFood.id ? hasExistedFood.count : (food.count || 0)
        }))
      }))
    }
  }
})

const { setMenuList, setActiveIndex, setCartList, addCartList, reduceCartList } = menuListStore.actions;
const menuListReducer = menuListStore.reducer;

const getMeueList = () => {
  return async (dispatch) => {
    const res = await axiox.get(`${DOMAIN}/takeaway`)
    dispatch(setMenuList(res.data))
  }
}

// 解构出创建action对象的函数
// 获取reducer对象的函数
// 导出创建action对象的函数和reducer函数
export { setMenuList, getMeueList, setActiveIndex, setCartList, addCartList, reduceCartList };
export default menuListReducer
