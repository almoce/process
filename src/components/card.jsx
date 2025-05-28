export function Card({title, children} = {}) {
  return (
    <div className="card">
      {title ? <h2 className="bg-red">{title}</h2> : null}
      {children}
    </div>
  );
}