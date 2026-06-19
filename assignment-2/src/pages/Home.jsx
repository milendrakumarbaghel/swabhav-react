import React, { useState, useRef, useEffect } from "react";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import Filters from "../components/Filters";
import Stats from "../components/Stats";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const inputRef = useRef(null);
  const editRef = useRef(null);
  const listRef = useRef(null);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (tasks.length > prevLengthRef.current) {
      inputRef.current.focus();
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    prevLengthRef.current = tasks.length;
  }, [tasks]);

  useEffect(() => {
    if (editingId !== null) {
      editRef.current.focus();
    }
  }, [editingId]);

  const addTask = () => {
    if (!inputValue.trim()) return;

    setTasks([
      ...tasks,
      { id: Date.now(), text: inputValue, done: false },
    ]);
    setInputValue("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.text);
  };

  const saveEdit = () => {
    setTasks(
      tasks.map((t) =>
        t.id === editingId ? { ...t, text: editValue } : t
      )
    );
    setEditingId(null);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "completed") return t.done;
    return true;
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;
  const remaining = total - completed;

  return (
    <div className="container">
      <h2>My Tasks</h2>

      <TaskInput
        inputRef={inputRef}
        inputValue={inputValue}
        setInputValue={setInputValue}
        addTask={addTask}
      />

      <Stats total={total} completed={completed} remaining={remaining} />

      <Filters
        filter={filter}
        setFilter={setFilter}
        total={total}
        completed={completed}
        remaining={remaining}
      />

      <TaskList
        listRef={listRef}
        tasks={filteredTasks}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
        editingId={editingId}
        editValue={editValue}
        setEditValue={setEditValue}
        startEdit={startEdit}
        saveEdit={saveEdit}
        setEditingId={setEditingId}
        editRef={editRef}
      />
    </div>
  );
}
