import Avatar from "./Avatar";
import Tag from "./Tag";
import StateSnapshot from "./StateSnapshot";
import "../styles/PreviewPanel.css";

export default function PreviewPanel({ form, submitted }) {
  return (
    <div className="panel">
      <div className="panel__header">
        <span className="panel__icon">👁️</span>
        <span className="panel__title panel__title--dark">Live preview</span>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <p className="profile-card__section-label">Profile Card</p>

        <div className="profile-card__header">
          <Avatar name={form.name || "?"} />
          <div className="profile-card__meta">
            <div className="profile-card__top-row">
              <div>
                <p className="profile-card__name">{form.name || "—"}</p>
                <p className="profile-card__email">{form.email || "—"}</p>
              </div>
              {submitted && <Tag variant="green">✓ Active</Tag>}
            </div>
          </div>
        </div>

        {form.course && (
          <div className="profile-card__course">
            <Tag variant="purple" icon="<>">{form.course}</Tag>
          </div>
        )}

        {form.bio && (
          <p className="profile-card__bio">{form.bio}</p>
        )}

        {form.skills.length > 0 && (
          <>
            <p className="profile-card__section-label">Skills</p>
            <div className="profile-card__skills">
              {form.skills.map((s) => (
                <span key={s} className="profile-card__skill-badge">{s}</span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* State Snapshot */}
      <StateSnapshot form={form} />

      <p className="ref-note">
        useRef in action: Name field auto-focused on mount. Edit button tracks bio focus state.
      </p>
    </div>
  );
}
