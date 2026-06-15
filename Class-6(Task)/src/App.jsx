import Task3 from "./Task3";
import Task1 from "./Task1";
import Task2 from "./Task2";
import Task4 from "./Task4";
import Task5 from "./Task5";

const App = () => {
  return (
    <main>
      <div className="first">
        <h2>Task-1</h2>
        <h4>Counter</h4>
        <Task1 />
      </div>

      <div className="second">
        <h2>Task-2</h2>
        <h4>Form</h4>
        <Task2 />
      </div>

      <div className="third">
        <h2>Task-3</h2>
        <h4>Password Hide and Show</h4>
        <Task3 />
      </div>

      <div className="fourth">
        <h2>Task-4</h2>
        <h4>Theme Toggler</h4>
        <Task4 />
      </div>
      
      <div className="fifth">
        <h2>Task-5</h2>
        <h4>To Do List</h4>
        <Task5 />
      </div>
    </main>
  );
};

export default App;
