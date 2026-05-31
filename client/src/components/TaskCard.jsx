import { memo } from 'react';
import Badge from './Badge';
import { formatDate } from '../utils/formatDate';

const priorityBorder = {
  low: 'border-l-green-400',
  medium: 'border-l-orange-400',
  high: 'border-l-red-400',
};

const TaskCard = memo(({ task, onEdit, onDelete }) => {
  return (
    <div className={`border-l-4 ${priorityBorder[task.priority]} bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-gray-800 truncate ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
          )}
        </div>

        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <Badge type="priority" value={task.priority} />
        <Badge type="status" value={task.status} />
        {task.dueDate && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            📅 {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
