import MemberRow from './MemberRow';
import './TeamSection.css';

function getBadgeClass(count) {
  if (count >= 3) return 'team-section__badge team-section__badge--green';
  if (count === 2) return 'team-section__badge team-section__badge--amber';
  return 'team-section__badge team-section__badge--red';
}

function TeamSection({ department, members }) {
  const sorted = [...members].sort((a, b) => b.experience - a.experience);

  return (
    <section className="team-section">
      <div className="team-section__header">
        <h2 className="team-section__title">{department}</h2>
        <span className="team-section__separator">·</span>
        <span className={getBadgeClass(members.length)}>{members.length}</span>
        <span className="team-section__count-label">
          {members.length === 1 ? '1 member' : `${members.length} members`}
        </span>
      </div>

      <div className="team-section__card">
        {members.length === 0 ? (
          <p className="team-section__empty">No members in this department.</p>
        ) : (
          sorted.map((member) => (
            <MemberRow
              key={member.id}
              name={member.name}
              role={member.role}
              experience={member.experience}
              initials={member.initials}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default TeamSection;
