export default function Card({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg shadow border ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
