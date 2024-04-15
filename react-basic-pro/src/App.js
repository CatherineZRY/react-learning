import './App.scss'
import CommentList from './CommentList'
import Tab from './Tab'
import PostComment from './PostComment'
import { useEffect, useState } from 'react'
import axios from 'axios'

export const DOMAIN = 'http://localhost:3004'

function useCommmentList(initList) {
  const [commentList, setCommentList] = useState(initList);
  useEffect(() => {
    // 请求列表数据
    function getList() {
      axios.get(`${DOMAIN}/list`).then((res) => {
        setCommentList(res.data || [])
      });
    }
    getList();
  }, [])
  return {
    commentList,
    setCommentList
  }
}

function useCurUser(initUser) {
  const [curUser, setCurUser] = useState(initUser);
  useEffect(() => {
    // 请求列表数据
    function getCurUser() {
      axios.get(`${DOMAIN}/cur-user`).then((res) => {
        setCurUser(res.data);
      });
    }
    getCurUser();
  }, [])
  return {
    curUser,
    setCurUser
  }
}

const App = () => {
  const { commentList, setCommentList } = useCommmentList([])
  const { curUser, setCurUser } = useCurUser(null);

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
          setCommentList={setCommentList}
          curUser={curUser} />
        {/* 评论列表 */}
        <CommentList commentList={commentList}
          setCommentList={setCommentList} />
      </div>
    </div>
  )
}

export default App