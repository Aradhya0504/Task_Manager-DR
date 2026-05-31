import { memo } from 'react';
import Badge from './Badge';
import Button from './Button';
import { formatDate } from '../utils/formatDate';

const TaskCard = memo(({ task, onEdit, onDelete }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className={`font-medium text-gray-800 flex-1 ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h3>
        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onEdit(task)}>
            Edit
          </Button>
          <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => onDelete(task._id)}>
            Delete
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <Badge type="priority" value={task.priority} />
        <Badge type="status" value={task.status} />
        {task.dueDate && (
          <span className="text-xs text-gray-400">Due: {formatDate(task.dueDate)}</span>
        )}
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
