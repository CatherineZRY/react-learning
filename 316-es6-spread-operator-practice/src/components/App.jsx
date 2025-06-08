import React from "react";
import ListItem from "./ListItem";
import InputArea from "./InputArea";

function App() {
  const [items, setItems] = React.useState([]);


  function handleClick(newItem) {
    if (newItem !== "") {
      setItems(prevItems => {
        return [...prevItems, { content: newItem, isDone: false }];
      });
    }
  }

  function renderItems() {
    return items.map(item => <ListItem
      key={item.content}
      text={item.content}
      isDone={item.isDone}
      afterItemHasBeenDone={afterItemHasBeenDone} />);
  }

  function afterItemHasBeenDone(content) {
    setItems(prevItems => {
      return prevItems.map(prevItem => {
        if (prevItem.content === content) {
          return { ...prevItem, isDone: !prevItem.isDone };
        }
        return prevItem;
      });
    });
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <InputArea addNewItem={handleClick} />
      <div>
        <ul>
          {renderItems()}
        </ul>
      </div>
    </div>
  );
}

export default App;
