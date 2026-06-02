export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const toInputDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

export const getDueReminder = (dueDate, status) => {
  if (!dueDate || status === 'done') return null;

  const now = new Date();
  const due = new Date(dueDate);

  // reset times to compare just dates
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0)  return { label: 'Overdue',         color: 'bg-red-100 text-red-600' };
  if (diffDays === 0) return { label: 'Due today',       color: 'bg-red-100 text-red-600' };
  if (diffDays === 1) return { label: 'Due tomorrow',    color: 'bg-orange-100 text-orange-600' };
  if (diffDays <= 6)  return { label: `Due in ${diffDays} days`, color: 'bg-yellow-100 text-yellow-700' };
  return null;
};

export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60)     return 'just now';
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateString);
};
