import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import api from './services/api';
import { getDueReminder } from './utils/formatDate';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthContext();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    api.get('/tasks').then((res) => {
      const count = res.data.filter((t) => getDueReminder(t.dueDate, t.status)).length;
      setAlertCount(count);
    }).catch(() => {});
  }, [user]);

  if (!user) return null;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-indigo-700 text-white shadow-sm'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 shadow-sm z-30 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-9 h-9 bg-indigo-700 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">TM</span>
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm leading-tight">TaskManager</p>
            <p className="text-xs text-gray-400">Manage your tasks</p>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 lg:hidden">✕</button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Main</p>

          <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
            <span className="text-base">📊</span>
            Dashboard
          </NavLink>

          <NavLink to="/tasks" className={linkClass} onClick={onClose}>
            <span className="text-base">✅</span>
            My Tasks
            {alertCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </NavLink>

          <div className="pt-3 pb-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Planning</p>
          </div>

          <NavLink to="/schedule" className={linkClass} onClick={onClose}>
            <span className="text-base">🗓️</span>
            Schedule
          </NavLink>

          <div className="pt-3 pb-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Account</p>
          </div>

          <NavLink to="/profile" className={linkClass} onClick={onClose}>
            <span className="text-base">👤</span>
            Profile
          </NavLink>
        </nav>

        {/* User info at bottom */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-gray-50">
            <div className="w-8 h-8 rounded-lg bg-indigo-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Layout = ({ children }) => {
  const { user } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <div className="w-5 h-0.5 bg-current mb-1"></div>
            <div className="w-5 h-0.5 bg-current mb-1"></div>
            <div className="w-5 h-0.5 bg-current"></div>
          </button>
          <span className="font-bold text-gray-800">TaskManager</span>
        </header>

        <main className="flex-1 p-2">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
              <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
