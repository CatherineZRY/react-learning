import React from "react";



function App() {
  const [isHovered, setIsHovered] = React.useState(false);

  function handleMouseEnter() {
    console.log("Mouse entered");
    setIsHovered(true);
  }

  function handleMouseLeave() {
    console.log("Mouse left");
    setIsHovered(false);
  }

  return (
    <div className="container">
      <h1>Hello</h1>
      <input type="text" placeholder="What's your name?" />
      <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={isHovered ? "btn-hoverd" : ""}>Submit</button>
    </div>
  );
}

export default App;
