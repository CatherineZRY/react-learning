import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";
import notes from "../notes";
import { useEffect, useState } from "react";
import Add from "./Add";


function App() {
  const [noteList, setNoteList] = useState([]);

  function createNote(noteItem, index) {
    return (
      <Note key={index}
        title={noteItem.title}
        content={noteItem.content}
        onDelete={() => {
          handleDelete(noteItem.key);
        }}
      />
    )
  }

  function handleAdd(noteItem) {
    setNoteList(prevNoteList => {
      const newNote = {
        ...noteItem,
        key: prevNoteList.length + 1
      }
      return [...prevNoteList, newNote];
    });
  }

  function handleDelete(key) {
    setNoteList(prevNoteList => {
      return prevNoteList.filter((note) => key !== note.key).map((note, index) => {
        return {
          ...note,
          key: index + 1
        }
      });
    });
  }

  // 仅初始化时执行
  useEffect(() => {
    setNoteList(notes);
  }, []);


  return (
    <div>
      <Header />
      <Add onAdd={handleAdd} />
      {noteList.map(createNote)}
      <Footer />
    </div>
  )
}

export default App;