import './MemberRow.css';

function MemberRow({ name, role, experience, initials }) {
  return (
    <div className="member-row">
      <div className="member-avatar">{initials}</div>

      <div className="member-info">
        <div className="member-name">{name}</div>
        <div className="member-role">{role}</div>
      </div>

      <div className="member-experience">
        {experience} yr{experience !== 1 ? 's' : ''} exp
      </div>

      <span className="member-chevron">›</span>
    </div>
  );
}

export default MemberRow;
