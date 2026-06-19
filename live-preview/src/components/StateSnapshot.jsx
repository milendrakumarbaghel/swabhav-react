import { truncate } from "../utils/stringHelpers";
import "../styles/StateSnapshot.css";

export default function StateSnapshot({ form }) {
  const snapshot = {
    name: form.name,
    email: form.email,
    course: form.course,
    bio: form.bio ? truncate(form.bio, 30) : "",
    skills: form.skills,
  };

  return (
    <div className="state-snapshot">
      <div className="state-snapshot__title">STATE SNAPSHOT (USESTATE)</div>
      <pre className="state-snapshot__pre">
{`{
  name: "${snapshot.name}",
  email: "${snapshot.email}",
  course: "${snapshot.course}",
  bio: "${snapshot.bio}",
  skills: [${snapshot.skills.map((s) => `"${s}"`).join(",")}]
}`}
      </pre>
    </div>
  );
}
