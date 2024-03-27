import { useRef, useState } from 'react'
import avatar from './images/bozai.png'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

function PostComment() {
  const postCommet = () => {
    console.log('post comment')
    const commentInfo = {
      rpid: uuidv4(),
      user: {
        uid: '36080105',
        avatar: '',
        uname: '许嵩',
      },
      content: curComment,
      ctime: dayjs(new Date()).format('MM-DD HH:mm'),
      like: 88,
    }
    console.log(commentInfo);
    setComment('');
    commenTextarea.current.focus();
  }
  const [curComment, setComment] = useState(''); // 输入内容清空
  const commenTextarea = useRef(null); // 将textarea重新聚焦

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
        <textarea ref={commenTextarea}
          className="reply-box-textarea"
          placeholder="发一条友善的评论"
          value={curComment}
          onChange={(value) => setComment(value.target.value)}
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