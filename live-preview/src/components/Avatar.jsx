import { getInitials } from "../utils/stringHelpers";
import "../styles/Avatar.css";

export default function Avatar({ name }) {
  return (
    <div className="avatar">
      {getInitials(name) || "?"}
    </div>
  );
}
