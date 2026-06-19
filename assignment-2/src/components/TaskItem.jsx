import React from "react";

export default function TaskItem({
  task,
  toggleTask,
  deleteTask,
  editingId,
  editValue,
  setEditValue,
  startEdit,
  saveEdit,
  setEditingId,
  editRef,
}) {
  return (
    <div className="task">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => toggleTask(task.id)}
      />

      {editingId === task.id ? (
        <>
          <input
            ref={editRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") setEditingId(null);
            }}
          />
          <button onClick={saveEdit}>✔</button>
        </>
      ) : (
        <span
          onDoubleClick={() => startEdit(task)}
          className={task.done ? "done" : ""}
        >
          {task.text}
        </span>
      )}

      <button onClick={() => deleteTask(task.id)}>❌</button>
    </div>
  );
}
