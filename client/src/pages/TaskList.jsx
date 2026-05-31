import { useState } from 'react';
import useTasks from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

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

  const openEdit = (task) => { setEditingTask(task); setModalOpen(true); };
  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTask(null); };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          <p className="text-sm text-gray-500 mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          + Add Task
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 mb-5 bg-white border border-gray-100 rounded-xl p-1.5 shadow-sm w-fit">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-indigo-700 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f.label}
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
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-500 font-medium">No tasks here yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {filter === 'all' ? 'Create your first task to get started' : `No ${filter} tasks found`}
          </p>
          {filter === 'all' && (
            <button
              onClick={openCreate}
              className="mt-4 text-indigo-600 text-sm font-medium hover:underline"
            >
              + Create a task
            </button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={openEdit} onDelete={handleDelete} />
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
