import './App.scss'
import avatar from './images/bozai.png'

function CommentList({ commentList, setCommentList }) {
  // const [commentList, setCommentList] = useState(DefaultList)


  const getUserAvatar = (usrAvarterUrl) => {
    return (
      < div className="root-reply-avatar" >
        <div className="bili-avatar">
          <img
            className="bili-avatar-img"
            alt={usrAvarterUrl}
          />
        </div>
      </div >
    )
  }

  const getUserName = (userName) => {
    return (
      <div className="user-info">
        <div className="user-name">{userName}</div>
      </div>
    )
  }

  const getContentAndOperation = (contentInfo) => {
    const handleDeleteComment = (id) => {
      const deletecList = commentList.filter((item) => item.rpid !== id)
      setCommentList(deletecList)
    }

    return (
      <div className="root-reply">
        <span className="reply-content">{contentInfo.content}</span>
        <div className="reply-info">
          {/* 评论时间 */}
          <span className="reply-time">{contentInfo.ctime}</span>
          {/* 评论数量 */}
          <span className="reply-time">点赞数:{contentInfo.like}</span>
          <span className="delete-btn" onClick={() => handleDeleteComment(contentInfo.rpid)}>
            删除
          </span>

        </div>
      </div>
    )
  }

  const getOneComment = (commentInfo) => {
    const contentInfo = {
      rpid: commentInfo.rpid,
      content: commentInfo.content,
      // 评论时间
      ctime: commentInfo.ctime,
      like: commentInfo.like
    }
    return (
      < div key={commentInfo.rpid} className="reply-item" >
        {/* 头像 */}
        {getUserAvatar(commentInfo.user.avatar)}
        <div className="content-wrap">
          {/* 用户名 */}
          {getUserName(commentInfo.user.uname)}
          {/* 评论内容 */}
          {getContentAndOperation(contentInfo)}
        </div>
      </div >
    )
  }



  return (
    <div className="reply-list">
      {/* 评论项 */}
      {commentList.map((commentInfo) => getOneComment(commentInfo))}
    </div>
  )
}

export default CommentList

