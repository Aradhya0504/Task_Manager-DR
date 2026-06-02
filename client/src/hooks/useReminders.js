import { useEffect, useRef } from 'react';
import api from '../services/api';

// Plays a soft beep using Web Audio API — no external file needed
const playBeep = (type = 'normal') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = type === 'urgent' ? 880 : 520;

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);
  } catch {
    // Audio not supported — fail silently
  }
};

const showNotification = (title, body, urgent = false) => {
  if (Notification.permission !== 'granted') return;

  const notification = new Notification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: title, // prevents duplicate notifications with same title
  });

  // Auto close after 6 seconds
  setTimeout(() => notification.close(), 6000);

  if (urgent) playBeep('urgent');
  else playBeep('normal');
};

const useReminders = (enabled) => {
  const notifiedRef = useRef(new Set()); // track which tasks we already notified

  useEffect(() => {
    if (!enabled) return;

    // Request permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkTasks = async () => {
      if (Notification.permission !== 'granted') return;

      try {
        const res = await api.get('/tasks');
        const tasks = res.data;
        const now = new Date();

        tasks.forEach((task) => {
          if (task.status === 'done' || !task.dueDate) return;

          const due = new Date(task.dueDate);
          const diffMinutes = Math.round((due - now) / 60000);
          const notifyKey = `${task._id}-${diffMinutes}`;

          // Already notified this exact task at this timing — skip
          if (notifiedRef.current.has(notifyKey)) return;

          // Overdue
          if (diffMinutes < 0 && diffMinutes > -60) {
            notifiedRef.current.add(notifyKey);
            showNotification(
              '⚠️ Task Overdue!',
              `"${task.title}" was due ${Math.abs(diffMinutes)} minutes ago.`,
              task.priority === 'high'
            );
          }

          // Due within 30 minutes
          if (diffMinutes >= 0 && diffMinutes <= 30) {
            notifiedRef.current.add(notifyKey);
            const msg = diffMinutes === 0
              ? `"${task.title}" is due right now!`
              : `"${task.title}" is due in ${diffMinutes} minutes.`;
            showNotification('⏰ Task Due Soon', msg, task.priority === 'high');
          }

          // Due in exactly 1 hour (±2 min window)
          if (diffMinutes >= 58 && diffMinutes <= 62) {
            notifiedRef.current.add(notifyKey);
            showNotification('📅 Upcoming Task', `"${task.title}" is due in about 1 hour.`, false);
          }
        });
      } catch {
        // silently fail
      }
    };

    // Check immediately, then every 60 seconds
    checkTasks();
    const interval = setInterval(checkTasks, 60000);

    return () => clearInterval(interval);
  }, [enabled]);
};

export default useReminders;
