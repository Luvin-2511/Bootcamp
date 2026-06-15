import { useState } from "react";

const Task4 = () => {
  const [dark, setDark] = useState(false);

  return (
    <div className={`wrapper ${dark ? "dark" : "light"}`}>
      <h1>{dark ? "Dark Mode" : "Light Mode"}</h1>
      <button onClick={() => setDark(prev => !prev)}>
        Toggle Theme
      </button>
    </div>
  );
};

export default Task4;