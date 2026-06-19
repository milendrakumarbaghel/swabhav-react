import "../styles/Tag.css";

export default function Tag({ children, variant = "purple", icon }) {
  return (
    <span className={`tag tag--${variant}`}>
      {icon && <span className="tag__icon">{icon}</span>}
      {children}
    </span>
  );
}
