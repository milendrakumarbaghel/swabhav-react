import React from "react";

export default function TaskInput({
  inputRef,
  inputValue,
  setInputValue,
  addTask,
}) {
  return (
    <div className="input-box">
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
        placeholder="Add a task..."
      />
      <button onClick={addTask}>Add</button>
    </div>
  );
}
