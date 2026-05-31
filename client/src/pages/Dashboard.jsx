import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import api from '../services/api';

const StatCard = ({ label, count, color, bg, icon }) => (
  <div className={`${bg} rounded-2xl p-5 flex flex-col gap-2 shadow-sm border border-white/60`}>
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-xl">{icon}</span>
    </div>
    <span className={`text-4xl font-bold ${color}`}>{count}</span>
  </div>
);

const Dashboard = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState({ total: 0, done: 0, pending: 0, inProgress: 0 });
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
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Hello, {user?.name} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's your task overview for today.</p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton rounded-2xl h-24"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total Tasks" count={stats.total} color="text-indigo-700" bg="bg-indigo-50" icon="📋" />
          <StatCard label="Completed" count={stats.done} color="text-green-600" bg="bg-green-50" icon="✅" />
          <StatCard label="In Progress" count={stats.inProgress} color="text-blue-600" bg="bg-blue-50" icon="🔄" />
          <StatCard label="To Do" count={stats.pending} color="text-orange-500" bg="bg-orange-50" icon="📌" />
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h2>
        <div className="flex gap-3">
          <Link
            to="/tasks"
            className="flex-1 text-center bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-800 transition-all shadow-sm"
          >
            View All Tasks
          </Link>
          <Link
            to="/tasks"
            className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
          >
            + Add New Task
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
