import FormPanel from "../components/FormPanel";
import PreviewPanel from "../components/PreviewPanel";
import { initialForm } from "../constants/initialForm";
import { useState } from "react";
import { isEmailValid } from "../utils/validation";
import "../styles/global.css";

export default function RegistrationForm() {
  const [step] = useState(1); // Step 2 (index 1) is active
  const [form, setForm] = useState({
    ...initialForm,
    name: "Aanya Sharma",
    phone: "9876543210",
    email: "aanya@example",
    course: "Web Development",
    bio: "Final year CS student passionate about building web apps and exploring full-stack development.",
    skills: ["React", "JavaScript", "CSS", "Node.js", "Git"],
  });
  const [skillInput, setSkillInput] = useState("");
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(true);

  const handleSubmit = () => {
    setTouched({ name: true, email: true });
    if (!form.name || !isEmailValid(form.email)) return;
    setSubmitted(true);
  };

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <div className="form-grid">
          <FormPanel
            form={form}
            setForm={setForm}
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            touched={touched}
            setTouched={setTouched}
            onSubmit={handleSubmit}
          />
          <PreviewPanel form={form} submitted={submitted} />
        </div>
      </div>
    </div>
  );
}
