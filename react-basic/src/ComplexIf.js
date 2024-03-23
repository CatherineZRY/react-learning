// 定义展示类型
const articleType = '0'

// 核心函数
function ComplexIf() {
  switch (articleType) {
    case '0':
      return getPureArticle();
    case '1':
      return getOnePictureArticle();
    case '2':
      return getMultiPicturesArticle();
    default:
      return (<div>--</div>)
  }
}

// 无图模式
function getPureArticle() {
  return (
    <div>{'pure article'}</div>
  )
}

// 单图模式
function getOnePictureArticle() {
  return (
    <div>{'one picture article'}</div>
  )
}

// 多图模式
function getMultiPicturesArticle() {
  return (
    <div>{'multi pictures article'}</div>
  )
}

export default ComplexIf