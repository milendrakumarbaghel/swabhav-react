import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList(props) {
  return (
    <div className="list" ref={props.listRef}>
      {props.tasks.map((task) => (
        <TaskItem key={task.id} task={task} {...props} />
      ))}
    </div>
  );
}
