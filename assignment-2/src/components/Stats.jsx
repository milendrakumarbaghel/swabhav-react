import React from "react";

export default function Stats({ total, completed, remaining }) {
  return (
    <div className="stats">
      <span>Total: {total}</span>
      <span>Completed: {completed}</span>
      <span>Remaining: {remaining}</span>
    </div>
  );
}
