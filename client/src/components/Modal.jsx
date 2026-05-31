import { useEffect, useState } from 'react';
import { validateTask } from '../utils/validators';
import { toInputDate } from '../utils/formatDate';

const defaultForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
};

const Modal = ({ isOpen, onClose, onSubmit, task }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: toInputDate(task.dueDate),
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateTask(form);
    if (Object.keys(validation).length > 0) { setErrors(validation); return; }
    setSubmitting(true);
    try {
      await onSubmit({ ...form, dueDate: form.dueDate || null });
      onClose();
    } catch {
      // parent handles error toast
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-800 text-base">{task ? 'Edit Task' : 'Create New Task'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{task ? 'Update task details' : 'Fill in the details below'}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-lg"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={inputClass}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more details (optional)"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟠 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="todo">📌 To Do</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="done">✅ Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className={inputClass} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-xl transition-all disabled:opacity-50 shadow-sm"
            >
              {submitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
