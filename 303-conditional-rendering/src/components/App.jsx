import React from "react";
import Login from "./Login";
import Intro from "./Intro";

let isLoggedIn = false;

function renderContent() {
  if (isLoggedIn) {
    return <Intro />;
  } else {
    return <Login />;
  }
}

function App() {
  return (
    <div className="container">
      {renderContent()}
    </div>
  );
}

export default App;
