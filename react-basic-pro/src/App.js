import './App.scss'
import CommentList from './CommentList'
import Tab from './Tab'
import PostComment from './PostComment'
import { DefaultList } from './Data'
import { useState } from 'react'


const App = () => {
  const [commentList, setCommentList] = useState(DefaultList)

  return (
    <div className="app">
      {/* 导航 Tab */}
      <div className="reply-navigation">
        <ul className="nav-bar">
          <li className="nav-title">
            <span className="nav-title-text">评论</span>
            {/* 评论数量 */}
            <span className="total-reply">{10}</span>
          </li>
          <Tab />
        </ul>
      </div>

      <div className="reply-wrap">
        {/* 发表评论 */}
        <PostComment commentList={commentList}
          setCommentList={setCommentList} />
        {/* 评论列表 */}
        <CommentList commentList={commentList}
          setCommentList={setCommentList} />
      </div>
    </div>
  )
}

export default App