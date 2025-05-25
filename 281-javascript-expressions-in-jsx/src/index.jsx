import React from "react";
import ReactDOM from "react-dom";

const name = "John";

function getUserAge() {
  if (name === "Catherine") {
    return 20;
  } else {
    return 18;
  }
}

function getUserExpression() {
  if (name === "Catherine") {
    return <p>Catherine is a good girl.</p>;
  } else {
    return <p>This kid is a bad kid.</p>;
  }
}

const element = (
  <div>
    <h1>Hello {name}!</h1>
    <p>This is a paragraph.</p>
    <p>User age: {getUserAge()}</p>
    {getUserExpression()}
  </div>
);

ReactDOM.render(element, document.getElementById("root"));

// If you're running this locally in VS Code use the commands:
// npm install
// to install the node modules and
// npm run dev
// to launch your react project in your browser
