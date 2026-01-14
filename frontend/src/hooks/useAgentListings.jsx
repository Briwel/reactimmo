import { useEffect, useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const SOCKET_URL = 'http://localhost:3000/properties';

export function useAgentListings() {
  const { user } = useUser();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/properties/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // If no user yet, skip
    if (!user?.id) return;

    // Connect socket with auth token
    const token = localStorage.getItem('token');
    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => {
      // console.log('Socket connected', socket.id);
    });

    socket.on('property.created', (payload) => {
      // Only add if it belongs to this user (server usually sends only to relevant room)
      if (!payload) return;
      setListings((prev) => [payload, ...prev]);
    });

    socket.on('property.updated', (payload) => {
      if (!payload) return;
      setListings((prev) => prev.map((p) => (p.id === payload.id ? payload : p)));
    });

    socket.on('property.deleted', ({ id }) => {
      setListings((prev) => prev.filter((p) => p.id !== id));
    });

    socket.on('connect_error', (err) => {
      // Fallback: try polling refresh periodically
      console.warn('Socket error, fallback to polling', err);
    });

    // Initial load
    refresh();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, refresh]);

  return { listings, loading, error, refresh };
}
