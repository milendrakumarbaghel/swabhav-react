import "../styles/SkillPill.css";

export default function SkillPill({ label, onRemove }) {
  return (
    <span className="skill-pill">
      {label}
      <button className="skill-pill__remove" onClick={onRemove} aria-label={`Remove ${label}`}>
        ×
      </button>
    </span>
  );
}
