import React, { useState } from "react";
import Home from "./Home";
import FormHandler from "./FormHandler";

const App = () => {
  const [counter, setCounter] = useState(0);

  const IncreaseCount = () => {
    setCounter(counter + 1);
  };
  const DecreaseCount = () => {
    if (counter > 0) {
      setCounter(counter - 1);
    }
  };
  const ResetCount = () => {
      setCounter(0);
  };
  return (
    <div>
      <h1>Counter</h1>
      <div className="count">{counter}</div>
      <div className="buttons">
        <div className="button" onClick={IncreaseCount}>
          Increase
        </div>
        <div className="button" onClick={DecreaseCount}>
          Decrease
        </div>
        <div className="button" onClick={ResetCount}>
          Reset
        </div>
      </div>
      <h1>Form</h1>
      <FormHandler />
    </div>
  );
};

export default App;
