import { useState } from 'react';
import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user, logout } = useAuth();

  const [reminders, setReminders] = useState(() => {
    return localStorage.getItem('reminders_enabled') === 'true';
  });

  const toggleReminders = () => {
    if (!reminders) {
      // Ask for permission when enabling
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          localStorage.setItem('reminders_enabled', 'true');
          setReminders(true);
        } else {
          alert('Please allow notifications in your browser settings to use reminders.');
        }
      });
    } else {
      localStorage.setItem('reminders_enabled', 'false');
      setReminders(false);
    }
  };

  const testReminder = () => {
    if (Notification.permission !== 'granted') {
      alert('Enable reminders first.');
      return;
    }
    const n = new Notification('⏰ Test Reminder', {
      body: 'Reminders are working! You will be notified when tasks are due.',
    });
    setTimeout(() => n.close(), 4000);

    // Play beep
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 520;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } catch {}
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

      {/* User card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-4">
        <div className="h-20 bg-gradient-to-r from-indigo-600 to-blue-500"></div>
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-indigo-700 border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-2xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
          <hr className="my-5 border-gray-100" />
          <button
            onClick={logout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 rounded-xl text-sm transition-colors border border-red-100"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Reminders settings */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-4">🔔 Reminder Settings</h2>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Task Reminders</p>
            <p className="text-xs text-gray-400 mt-0.5">Get notified when tasks are due soon</p>
          </div>
          {/* Toggle switch */}
          <button
            onClick={toggleReminders}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              reminders ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              reminders ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {reminders && (
          <div className="space-y-2 text-xs text-gray-500 bg-indigo-50 rounded-xl p-3 mb-4">
            <p>✅ Notifications are <strong>enabled</strong></p>
            <p>⏰ You'll be notified <strong>30 minutes</strong> before a task is due</p>
            <p>🔴 High priority tasks play an <strong>alert sound</strong></p>
            <p>⚠️ Overdue tasks also trigger a notification</p>
          </div>
        )}

        <button
          onClick={testReminder}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm transition-colors"
        >
          🔔 Test Reminder Sound
        </button>
      </div>
    </div>
  );
};

export default Profile;
