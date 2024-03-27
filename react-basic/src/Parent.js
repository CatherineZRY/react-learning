import Son from './Son'

function Parent() {
  const childName = 'test1'
  return (
    <div>
      <span>This is parent</span>
      <span>There is a son:</span>
      <Son name={childName}
        age={20}
        cb={() => alert('this is a function')} />
    </div>
  )
}
export default Parent