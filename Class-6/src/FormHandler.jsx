import React, { useState } from "react";

const FormHandler = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  return (
    <div className="form">
      <input
        name="name"
        value={name}
        type="text"
        onChange={(e) => {
          setName(e.target.value);
        }}
        placeholder="Enter your name"
      />
      <div className="wrapper">
        <input className="inputdiv"
          name="password"
          value={password}
          type={showPass ? "text" : "password"}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Enter your password"
        />
        <button
          className="shower"
          onClick={() => {
            setShowPass(!showPass);
          }}
        >
          {showPass ? "Hide" : "Show"}
        </button>
      </div>
      <input type="submit" placeholder="submit" />
    </div>
  );
};

export default FormHandler;
