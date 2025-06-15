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

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gridTemplateRows: "repeat(auto-fit, minmax(200px, 1fr))",
    justifyItems: "center",
    alignItems: "start",
    gap: "10px"
  }

  return (
    <div>
      <Header />
      <Add onAdd={handleAdd} />

      {/* 原有的Note组件网格 */}
      <div style={containerStyle}>
        {noteList.map(createNote)}
      </div>
      <Footer />
    </div>
  )
}

export default App;