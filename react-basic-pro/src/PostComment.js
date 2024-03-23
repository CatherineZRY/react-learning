import avatar from './images/bozai.png'

function PostComment() {
  const postCommet = () => {
    console.log('post comment')
    const commentInfo = {
      rpid: 2,
      user: {
        uid: '36080105',
        avatar: '',
        uname: '许嵩',
      },
      content: '我寻你千百度 日出到迟暮',
      ctime: '11-13 11:29',
      like: 88,
    }
    alert(commentInfo)
  }

  return (
    <div className="box-normal">
      {/* 当前用户头像 */}
      <div className="reply-box-avatar">
        <div className="bili-avatar">
          <img className="bili-avatar-img" src={avatar} alt="用户头像" />
        </div>
      </div>
      <div className="reply-box-wrap">
        {/* 评论框 */}
        <textarea
          className="reply-box-textarea"
          placeholder="发一条友善的评论"
        />
        {/* 发布按钮 */}
        <div className="reply-box-send">
          <div className="send-text" onClick={postCommet}>发布</div>
        </div>
      </div>
    </div>
  )
}

export default PostComment