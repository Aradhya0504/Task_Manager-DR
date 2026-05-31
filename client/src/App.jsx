import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import Profile from './pages/Profile';

const Nav = () => {
  const { user } = useAuthContext();
  if (!user) return null;

  const linkClass = ({ isActive }) =>
    `text-sm font-medium px-3 py-1.5 rounded-md transition-all ${
      isActive
        ? 'bg-white text-indigo-700 shadow-sm'
        : 'text-indigo-100 hover:text-white hover:bg-indigo-600'
    }`;

  return (
    <header className="bg-indigo-700 shadow-md">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <span className="text-indigo-700 font-bold text-xs">TM</span>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">TaskManager</span>
        </div>
        <nav className="flex gap-1">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/tasks" className={linkClass}>Tasks</NavLink>
          <NavLink to="/profile" className={linkClass}>Profile</NavLink>
        </nav>
      </div>
    </header>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50">
            <Nav />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
