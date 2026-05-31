import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import api from '../services/api';

const StatCard = ({ label, count, color }) => (
  <div className={`bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1`}>
    <span className="text-sm text-gray-500">{label}</span>
    <span className={`text-3xl font-bold ${color}`}>{count}</span>
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
        // silently fail on dashboard
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Hello, {user?.name} 👋
      </h1>
      <p className="text-gray-500 text-sm mb-6">Here's what's going on with your tasks.</p>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton rounded-lg h-20"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total" count={stats.total} color="text-gray-800" />
          <StatCard label="Done" count={stats.done} color="text-green-600" />
          <StatCard label="In Progress" count={stats.inProgress} color="text-blue-600" />
          <StatCard label="To Do" count={stats.pending} color="text-orange-500" />
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/tasks"
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Go to Tasks
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
