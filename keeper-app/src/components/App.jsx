import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";
import notes from "../notes";

function createNote(noteItem, index) {
  return (
    <Note key={index} title={noteItem.title} content={noteItem.content} />
  )
}


function App() {
  return (
    <div>
      <Header />
      {notes.map(createNote)}
      <Footer />
    </div>
  )
}

export default App;