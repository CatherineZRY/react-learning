const frontendList = [
  { name: 'Vue', id: 1001 },
  { name: 'React', id: 1002 },
  { name: 'Angular', id: 1003 },
]

function List() {
  return (
    <ul>
      {/* 注意：需要为每一个可便利的对象添加一个key，需要为number类型或者string类型，用于优化页面渲染效率 */}
      {frontendList.map((item) => <li key={item.id}>{item.name}{'('}{item.id}{')'}</li>)}
    </ul>
  )
}

export default List;