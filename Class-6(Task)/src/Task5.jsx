import { useState } from "react";

function Task5() {
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);

  const addTask = () => {
    setList([...list, task]);
    setTask("");
  };

  return (
    <div>
      <input value={task} onChange={(e) => setTask(e.target.value)} />
      <button className="shower" onClick={addTask}>Add Task</button>

      {list.map((item, index) => (
        <p className="tasks" key={index}>{item}</p>
      ))}
    </div>
  );
}

export default Task5;
