const priorityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700',
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
};

const Badge = ({ type, value }) => {
  const colorClass = type === 'priority' ? priorityColors[value] : statusColors[value];
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${colorClass}`}>
      {value}
    </span>
  );
};

export default Badge;
