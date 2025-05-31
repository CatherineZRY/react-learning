import React from "react";
import Card from "./Card";
import Avatar from "./Avatar";
import { contacts } from "../contacts";

// 使用key仅用于React的列表渲染优化
// 如果需要在组件内部使用相同的值，通过其他prop名称传递（如id、identifier等）
// 保持key的唯一性和稳定性，避免使用数组索引作为key（除非列表是静态的）
function createCard(contact, index) {
  return (
    <Card key={index}
      name={contact.name}
      img={contact.imgURL}
      phone={contact.phone}
      email={contact.email} />
  )
}

function App() {

  return (
    <div>
      <h1 className="heading">My Contacts</h1>
      <Avatar img={contacts[0].imgURL} />
      {contacts.map(createCard)}
    </div>
  );
}

export default App;
