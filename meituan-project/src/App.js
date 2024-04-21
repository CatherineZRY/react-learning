import NavBar from './components/NavBar'
import Menu from './components/Menu'
import Cart from './components/Cart'
import FoodsCategory from './components/FoodsCategory'
import { useDispatch, useSelector } from "react-redux"
import './App.scss'
import { useEffect } from 'react'
import { getMeueList } from './store/modules/menuListStore'

export const DOMAIN = 'http://localhost:3004'


const App = () => {
  const foodsList = useSelector(state => state.menu.menuList)
  const activeIndex = useSelector(state => state.menu.activeIndex);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMeueList())
  }, [dispatch]);

  return (
    <div className="home">
      {/* 导航 */}
      <NavBar />

      {/* 内容 */}
      <div className="content-wrap">
        <div className="content">
          <Menu />

          <div className="list-content">
            <div className="goods-list">
              {/* 外卖商品列表 */}
              {foodsList.map((item, index) => {
                return (
                  activeIndex === index &&
                  <FoodsCategory
                    key={item.tag}
                    // 列表标题
                    name={item.name}
                    // 列表商品
                    foods={item.foods}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 购物车 */}
      <Cart />
    </div>
  )
}

export default App
