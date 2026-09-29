export default function GuideCard({ q, a }: { q: string; a: string }) {
  return (
    <div className="guide">
      <h3 className="t-label">{q}</h3>
      <p className="t-body-sm c2">{a}</p>
    </div>
  );
}
