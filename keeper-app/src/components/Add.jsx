import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";

function Add(props) {
  const [formValue, setFormValue] = React.useState({
    title: "",
    content: ""
  });
  const [showContent, setShowContent] = React.useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValue(prevValue => {
      return {
        ...prevValue,
        [name]: value
      }
    })
  }

  function handleAddClick() {
    props.onAdd(formValue);
    setFormValue({
      title: "",
      content: ""
    });
  }

  return (
    <form className="create-note">
      <input type="text"
        name="title"
        value={formValue.title}
        placeholder="Title"
        onChange={handleChange}
        onFocus={() => setShowContent(!showContent)} />
      {showContent && (
        <textarea type="text"
          name="content"
          value={formValue.content}
          placeholder="Content"
          onChange={handleChange} />
      )}
      <Zoom in={showContent}>
        <Fab onClick={handleAddClick} type="button">
          <AddIcon />
        </Fab>
      </Zoom>
    </form>
  );
}

export default Add;