import { useState } from 'react';
import useTasks from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';

const FILTERS = ['all', 'todo', 'in-progress', 'done'];

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
      showToast('Task created');
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

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">My Tasks</h1>
        <Button onClick={openCreate}>+ Add Task</Button>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm capitalize border transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && <LoadingSkeleton count={3} />}

      {!loading && error && (
        <div className="text-center text-red-500 text-sm py-8">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No tasks here yet.</p>
          {filter === 'all' && (
            <button onClick={openCreate} className="mt-2 text-blue-500 text-sm hover:underline">
              Create your first task
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
