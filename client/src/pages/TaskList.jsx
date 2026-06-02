import { useState } from 'react';
import useTasks from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';
import useDebounce from '../hooks/useDebounce';
import { formatDate } from '../utils/formatDate';

const exportToCSV = (tasks) => {
  const headers = ['Title', 'Description', 'Status', 'Priority', 'Due Date', 'Created At'];
  const rows = tasks.map((t) => [
    `"${t.title}"`,
    `"${t.description || ''}"`,
    t.status,
    t.priority,
    t.dueDate ? formatDate(t.dueDate) : 'No due date',
    formatDate(t.createdAt),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my-tasks.csv';
  a.click();
  URL.revokeObjectURL(url);
};

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const TaskList = () => {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const showToast = useToast();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const filtered = tasks
    .filter((t) => filter === 'all' || t.status === filter)
    .filter((t) => t.title.toLowerCase().includes(debouncedSearch.toLowerCase()));

  const countFor = (status) =>
    status === 'all' ? tasks.length : tasks.filter((t) => t.status === status).length;

  const handleCreate = async (data) => {
    try {
      await createTask(data);
      showToast('Task created successfully');
    } catch {
      showToast('Failed to create task', 'error');
      throw new Error('Failed');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateTask(editingTask._id, data);
      showToast('Task updated');
    } catch {
      showToast('Failed to update task', 'error');
      throw new Error('Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      showToast('Task deleted', 'info');
    } catch {
      showToast('Failed to delete task', 'error');
    }
  };

  const handleToggleDone = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      await updateTask(task._id, { status: newStatus });
      showToast(newStatus === 'done' ? 'Task completed!' : 'Task reopened');
    } catch {
      showToast('Failed to update task', 'error');
    }
  };

  const openEdit = (task) => { setEditingTask(task); setModalOpen(true); };
  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTask(null); };

  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          <p className="text-sm text-gray-500 mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex items-center gap-2">
          {tasks.length > 0 && (
            <button
              onClick={() => exportToCSV(tasks)}
              className="bg-white border border-gray-200 text-gray-600 text-sm font-medium px-3 py-2.5 rounded-xl transition-all hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
              title="Export as CSV"
            >
              ⬇ Export
            </button>
          )}
          <button
            onClick={openCreate}
            className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div className="mb-5 mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{doneCount} of {tasks.length} completed</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-green-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="relative mb-4">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            &times;
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex gap-1.5 mb-5 bg-white border border-gray-100 rounded-xl p-1.5 shadow-sm w-fit">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              filter === f.value
                ? 'bg-indigo-700 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              filter === f.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {countFor(f.value)}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && <LoadingSkeleton count={3} />}

      {!loading && error && (
        <div className="text-center py-12">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-5xl mb-3">{search ? '🔍' : '📭'}</div>
          <p className="text-gray-600 font-semibold">
            {search ? 'No matching tasks' : 'No tasks here yet'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {search
              ? `No tasks match "${search}"`
              : filter === 'all'
              ? 'Create your first task to get started'
              : `No ${filter} tasks found`}
          </p>
          {filter === 'all' && !search && (
            <button
              onClick={openCreate}
              className="mt-4 bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-indigo-800 transition-all"
            >
              + Create a task
            </button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggleDone={handleToggleDone}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        task={editingTask}
      />
    </div>
  );
};

export default TaskList;
