import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import api from '../services/api';

const StatCard = ({ label, count, color, bg, icon, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className={`${bg} rounded-2xl p-5 flex flex-col gap-3 shadow-sm border border-white/60 hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <span className={`text-4xl font-bold ${color}`}>{count}</span>
      {total > 0 && label !== 'Total Tasks' && (
        <div>
          <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`} style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{pct}% of total</p>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState({ total: 0, done: 0, pending: 0, inProgress: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        const res = await api.get('/tasks');
        if (cancelled) return;
        const tasks = res.data;
        setStats({
          total: tasks.length,
          done: tasks.filter((t) => t.status === 'done').length,
          inProgress: tasks.filter((t) => t.status === 'in-progress').length,
          pending: tasks.filter((t) => t.status === 'todo').length,
        });
        setRecentTasks(tasks.slice(0, 3));
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStats();
    return () => { cancelled = true; };
  }, []);

  const progress = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const priorityDot = { low: 'bg-green-400', medium: 'bg-orange-400', high: 'bg-red-500' };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hello, {user?.name} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's your task overview.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton rounded-2xl h-28" />)}
          </div>
        </div>
      ) : (
        <>
          {/* Overall progress */}
          {stats.total > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-indigo-700">{progress}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-green-400 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">{stats.done} of {stats.total} tasks completed</p>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatCard label="Total Tasks" count={stats.total} color="text-indigo-700" bg="bg-indigo-50" icon="📋" total={stats.total} />
            <StatCard label="Completed" count={stats.done} color="text-green-600" bg="bg-green-50" icon="✅" total={stats.total} />
            <StatCard label="In Progress" count={stats.inProgress} color="text-blue-600" bg="bg-blue-50" icon="🔄" total={stats.total} />
            <StatCard label="To Do" count={stats.pending} color="text-orange-500" bg="bg-orange-50" icon="📌" total={stats.total} />
          </div>

          {/* Recent Tasks */}
          {recentTasks.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">Recent Tasks</h2>
                <Link to="/tasks" className="text-xs text-indigo-600 hover:underline font-medium">View all</Link>
              </div>
              <div className="space-y-2.5">
                {recentTasks.map((task) => (
                  <div key={task._id} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${priorityDot[task.priority]}`} />
                    <span className={`text-sm flex-1 truncate ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.title}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      task.status === 'done' ? 'bg-green-100 text-green-600' :
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h2>
            <div className="flex gap-3">
              <Link to="/tasks" className="flex-1 text-center bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800 transition-all shadow-sm active:scale-95">
                View All Tasks
              </Link>
              <Link to="/tasks" className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all active:scale-95">
                + Add New Task
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
