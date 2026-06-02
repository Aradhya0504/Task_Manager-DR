import { useEffect, useState } from 'react';
import api from '../services/api';
import Badge from '../components/Badge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { formatDate } from '../utils/formatDate';

const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

const isThisWeek = (date) => {
  const d = new Date(date);
  const today = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(today.getDate() + 7);
  return d > today && d <= weekFromNow;
};

const isThisMonth = (date) => {
  const d = new Date(date);
  const today = new Date();
  const monthFromNow = new Date();
  monthFromNow.setDate(today.getDate() + 30);
  return d > new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) && d <= monthFromNow;
};

const isOverdue = (date, status) => {
  if (status === 'done') return false;
  return new Date(date) < new Date() && !isToday(date);
};

const EmptyGroup = ({ message }) => (
  <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
    {message}
  </div>
);

const TaskRow = ({ task }) => (
  <div className={`flex items-start gap-3 p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${
    task.status === 'done' ? 'opacity-60' : ''
  }`}>
    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
      task.priority === 'high' ? 'bg-red-500' :
      task.priority === 'medium' ? 'bg-orange-400' : 'bg-green-400'
    }`} />
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-semibold text-gray-800 ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
        {task.title}
      </p>
      {task.description && (
        <p className="text-xs text-gray-400 mt-0.5 truncate">{task.description}</p>
      )}
      <div className="flex items-center gap-2 mt-2">
        <Badge type="priority" value={task.priority} />
        <Badge type="status" value={task.status} />
      </div>
    </div>
    <span className="text-xs text-gray-400 shrink-0 mt-0.5">{formatDate(task.dueDate)}</span>
  </div>
);

const Section = ({ title, icon, tasks, emptyMsg, accent }) => (
  <div className="mb-6">
    <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${accent}`}>
      <span className="text-lg">{icon}</span>
      <h2 className="font-bold text-gray-800">{title}</h2>
      <span className="ml-auto text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
        {tasks.length} task{tasks.length !== 1 ? 's' : ''}
      </span>
    </div>
    {tasks.length === 0 ? (
      <EmptyGroup message={emptyMsg} />
    ) : (
      <div className="space-y-2">
        {tasks.map((task) => <TaskRow key={task._id} task={task} />)}
      </div>
    )}
  </div>
);

const Schedule = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        if (!cancelled) setTasks(res.data);
      } catch {
        if (!cancelled) setError('Failed to load tasks');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTasks();
    return () => { cancelled = true; };
  }, []);

  const withDueDate = tasks.filter((t) => t.dueDate);

  const overdue  = withDueDate.filter((t) => isOverdue(t.dueDate, t.status));
  const today    = withDueDate.filter((t) => isToday(t.dueDate) && t.status !== 'done');
  const week     = withDueDate.filter((t) => isThisWeek(t.dueDate));
  const month    = withDueDate.filter((t) => isThisMonth(t.dueDate));
  const noDue    = tasks.filter((t) => !t.dueDate && t.status !== 'done');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">Your tasks organized by due date.</p>
      </div>

      {loading && <LoadingSkeleton count={4} />}

      {!loading && error && (
        <p className="text-red-400 text-sm text-center py-8">{error}</p>
      )}

      {!loading && !error && (
        <>
          {/* Overdue */}
          {overdue.length > 0 && (
            <Section
              title="Overdue"
              icon="⚠️"
              tasks={overdue}
              emptyMsg=""
              accent="border-red-400"
            />
          )}

          <Section
            title="Today"
            icon="📅"
            tasks={today}
            emptyMsg="No tasks due today"
            accent="border-indigo-500"
          />

          <Section
            title="Next 7 Days"
            icon="📆"
            tasks={week}
            emptyMsg="No tasks due this week"
            accent="border-blue-400"
          />

          <Section
            title="This Month"
            icon="🗓️"
            tasks={month}
            emptyMsg="No tasks due this month"
            accent="border-green-400"
          />

          {noDue.length > 0 && (
            <Section
              title="No Due Date"
              icon="📌"
              tasks={noDue}
              emptyMsg=""
              accent="border-gray-300"
            />
          )}

          {withDueDate.length === 0 && noDue.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-600 font-semibold">No tasks yet</p>
              <p className="text-gray-400 text-sm mt-1">Add tasks with due dates to see them here</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Schedule;
