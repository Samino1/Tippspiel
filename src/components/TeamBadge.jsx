// Vereinswappen + Name. Auf schmalen Bildschirmen wird nur der Kurzname gezeigt (per CSS).
export default function TeamBadge({ team, align = 'left' }) {
  return (
    <div className={`team team--${align}`}>
      <img
        className="team__icon"
        src={team.icon}
        alt=""
        onError={(event) => (event.currentTarget.style.visibility = 'hidden')}
      />
      <span className="team__name">{team.name}</span>
      <span className="team__short">{team.short}</span>
    </div>
  );
}
