import { memo } from 'react';
import Badge from './Badge';
import { formatDate } from '../utils/formatDate';

const priorityBorder = {
  low: 'border-l-green-400',
  medium: 'border-l-orange-400',
  high: 'border-l-red-500',
};

const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'done') return false;
  return new Date(dueDate) < new Date();
};

const TaskCard = memo(({ task, onEdit, onDelete, onToggleDone }) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className={`border-l-4 ${priorityBorder[task.priority]} bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 group`}>
      <div className="flex items-start gap-3">
        {/* Checkbox to mark done */}
        <button
          onClick={() => onToggleDone(task)}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
            task.status === 'done'
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {task.status === 'done' && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className={`font-semibold text-gray-800 ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
              )}
            </div>

            {/* Action buttons - visible on hover */}
            <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
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

          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <Badge type="priority" value={task.priority} />
            <Badge type="status" value={task.status} />
            {task.dueDate && (
              <span className={`text-xs flex items-center gap-1 font-medium ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
                {overdue ? '⚠ Overdue:' : '📅'} {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
