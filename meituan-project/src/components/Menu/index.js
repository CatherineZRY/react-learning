import { useDispatch, useSelector } from "react-redux"
import classNames from 'classnames'
import './index.scss';
import { setActiveIndex } from '../../store/modules/menuListStore'
import { useEffect, useState } from "react"

const Menu = () => {
  const foodsList = useSelector(state => state.menu.menuList);
  const activeIndex = useSelector(state => state.menu.activeIndex);
  // const menus = foodsList.map(item => ({ tag: item.tag, name: item.name })) || [];
  const [menus, setMenus] = useState(foodsList.map(item => ({ tag: item.tag, name: item.name })) || []);
  const dispatch = useDispatch()
  // const { activeId, setActiveId } = useState();
  useEffect(() => {
    const menusTmp = foodsList.map(item => ({ tag: item.tag, name: item.name }))
    setMenus(menusTmp)
    if (menusTmp.length > 0) {
      dispatch(setActiveIndex(0))
    }
  }, [foodsList, dispatch]);

  return (
    <nav className="list-menu">
      {/* 添加active类名会变成激活状态 */}
      {menus.map((item, index) => {
        return (
          <div key={item.tag}
            className={classNames('list-menu-item', { active: activeIndex === index })}
            onClick={() => dispatch(setActiveIndex(index))}
          >
            {item.name}
          </div>
        )
      })}
    </nav>
  )
}

export default Menu
