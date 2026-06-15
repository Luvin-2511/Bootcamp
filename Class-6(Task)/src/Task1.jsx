import { useState } from "react";

const Task1 = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div className="task1-wrapper">
      <h3>{counter}</h3>
      <div className="buttons">
        <button className="increment" onClick={() => setCounter(c => c + 1)}>
          increment
        </button>
        <button className="decrement" onClick={() => setCounter(c => c - 1)}>
          decrement
        </button>
        <button className="reset" onClick={() => setCounter(0)}>
          reset
        </button>
      </div>
    </div>
  );
};

export default Task1;