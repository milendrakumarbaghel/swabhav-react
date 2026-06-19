import React from "react";

export default function Filters({
  filter,
  setFilter,
  total,
  completed,
  remaining,
}) {
  return (
    <div className="filters">
      <button className={filter === "all" ? "active" : ""}
      onClick={() => setFilter("all")}>
        All ({total})
      </button>
      <button onClick={() => setFilter("active")}>
        Active ({remaining})
      </button>
      <button onClick={() => setFilter("completed")}>
        Completed ({completed})
      </button>
    </div>
  );
}
