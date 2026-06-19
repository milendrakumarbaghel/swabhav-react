import React from "react";
import "./SummaryCard.css";

const SummaryCard = ({ title, count, active, onClick }) => {
  return (
    <div
      className={`card ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <h2>{title}</h2>
      <p>Total - {count}</p>
    </div>
  );
};

export default SummaryCard;
