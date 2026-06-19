import { useRef, useEffect } from "react";
import SkillPill from "./SkillPill";
import { isEmailValid } from "../utils/validation";
import { addSkill } from "../utils/skillHelpers";
import "../styles/FormPanel.css";

export default function FormPanel({
  form,
  setForm,
  skillInput,
  setSkillInput,
  touched,
  setTouched,
  onSubmit,
}) {
  const nameRef = useRef(null);
  const bioRef = useRef(null);

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus();
  }, []);

  const setField = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleAddSkill = () => {
    const updated = addSkill(form.skills, skillInput);
    setForm((f) => ({ ...f, skills: updated }));
    setSkillInput("");
  };

  const handleRemoveSkill = (skill) =>
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));

  const handleSkillKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const bioLen = form.bio.length;
  const emailError = touched.email && !isEmailValid(form.email);
  const nameError = touched.name && !form.name;

  return (
    <div className="panel">
      <div className="panel__header">
        <span className="panel__icon">🖥️</span>
        <span className="panel__title panel__title--purple">Registration form</span>
      </div>

      {/* Name + Phone */}
      <div className="field-row">
        <div className="field-group">
          <label className="field-label">
            Full name <span className="field-label__required">*</span>
          </label>
          <input
            ref={nameRef}
            value={form.name}
            onChange={setField("name")}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            className={`field-input${nameError ? " field-input--error" : ""}`}
            placeholder="Full name"
          />
          <p className="field-hint">useRef auto-focuses this on mount</p>
        </div>
        <div className="field-group">
          <label className="field-label">Phone</label>
          <input
            value={form.phone}
            onChange={setField("phone")}
            className="field-input"
            placeholder="Phone"
          />
        </div>
      </div>

      {/* Email */}
      <div className="field-group">
        <label className="field-label">
          Email address <span className="field-label__required">*</span>
        </label>
        <input
          value={form.email}
          onChange={setField("email")}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          className={`field-input${emailError ? " field-input--error" : ""}`}
          placeholder="Email address"
        />
        {emailError && (
          <p className="field-error">⊗ Enter a valid email address</p>
        )}
      </div>

      {/* Course */}
      <div className="field-group">
        <label className="field-label">Course</label>
        <input
          value={form.course}
          onChange={setField("course")}
          className="field-input"
          placeholder="Course"
        />
      </div>

      {/* Bio */}
      <div className="field-group">
        <label className="field-label">Bio</label>
        <textarea
          ref={bioRef}
          value={form.bio}
          onChange={setField("bio")}
          maxLength={150}
          rows={3}
          className="field-input field-input--textarea"
          placeholder="Tell us about yourself..."
        />
        <div className="bio-footer">
          <span className="bio-footer__hint">useRef tracks this field's focus state</span>
          <span className={`bio-footer__counter${bioLen > 130 ? " bio-footer__counter--warn" : ""}`}>
            {bioLen} / 150
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="field-group">
        <label className="field-label">Skills</label>
        <div className="skills-input-row">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKey}
            className="field-input"
            placeholder="Type a skill, press Enter or Add..."
          />
          <button className="btn-add" onClick={handleAddSkill}>+ Add</button>
        </div>
        <div className="skill-pills">
          {form.skills.map((s) => (
            <SkillPill key={s} label={s} onRemove={() => handleRemoveSkill(s)} />
          ))}
        </div>
      </div>

      <button className="btn-submit" onClick={onSubmit}>
        ➤ Submit registration
      </button>
    </div>
  );
}
