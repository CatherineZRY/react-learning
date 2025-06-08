import React from "react";

function InputArea(props) {
  const [inputText, setInputText] = React.useState("");

  function handleChange(event) {
    setInputText(event.target.value);
  }

  function handleClick() {
    props.addNewItem(inputText);
    setInputText("");
  }

  return (
    <div className="form">
      <input type="text" onChange={handleChange} value={inputText} />
      <button onClick={handleClick}>
        <span>Add</span>
      </button>
    </div>
  );
}

export default InputArea;