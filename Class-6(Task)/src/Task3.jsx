import { useState } from "react";

function Task3() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <input type={showPassword ? "text" : "password"} />
      <button className="shower" onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export default Task3;