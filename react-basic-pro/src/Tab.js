import { useState } from "react"
import { Tabs } from './Data'
import classNames from 'classnames' // 用于控制类名的第三方库

function Tab() {
  const [tabList, setTabList] = useState(Tabs)
  const [activedTabId, setActivedTabId] = useState('')

  const changeActivedTab = (tabId) => {
    setActivedTabId(tabId)
  }

  return (
    <li className="nav-sort">
      {tabList.map((tabItem) => (
        < span key={tabItem.type}
          // className={activedTabId === tabItem.type ? 'nav-item active' : 'nav-item'}
          className={classNames('nav-item', { active: activedTabId === tabItem.type })}
          onClick={() => { changeActivedTab(tabItem.type) }}>{tabItem.text}</span>
      ))}
    </li >
  )
}

export default Tab