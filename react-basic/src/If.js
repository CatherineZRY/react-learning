let isOpened = false;

function If() {
  return (
    <div>
      {/* 逻辑分支语法 */}
      <div>
        {isOpened && <span>button is clicked</span>}
        {!isOpened && <span>button is not clicked</span>}
      </div>
      {/* 三元运算符 */}
      <div>
        {isOpened ? <span>button is clicked1</span> : <span>button is not clicked1</span>}
      </div>
    </div>
  )
}

export default If