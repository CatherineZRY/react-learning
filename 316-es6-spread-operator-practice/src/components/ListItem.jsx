import React from "react";

function ListItem(props) {

  const styles = {
    textDecoration: props.isDone ? "line-through" : "none"
  }

  function handleClick() {
    props.afterItemHasBeenDone(props.text);
  }

  return <li style={styles} onClick={handleClick}>{props.text}</li>;
}

export default ListItem;