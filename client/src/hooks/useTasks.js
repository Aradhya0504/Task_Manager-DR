import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tasks on mount, cleanup handled by React strict mode double-invoke
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/tasks');
        if (!cancelled) setTasks(res.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load tasks');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, []);

  const createTask = async (data) => {
    const res = await api.post('/tasks', data);
    setTasks((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateTask = async (id, data) => {
    const res = await api.patch(`/tasks/${id}`, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    return res.data;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask };
};

export default useTasks;
