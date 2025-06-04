import { useState, useEffect } from 'react';
import socket from '../socket';

export default function useReplicationToasts() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleReReplication = (data) => {
      console.log('useReplicationToasts received re-replication:', data);
      const id = Date.now();
      setToasts((prev) => [...prev, { ...data, id }]);

      // Auto-remove after 5s
      setTimeout(() => {
        setToasts((prev) => prev.filter(t => t.id !== id));
      }, 5000);
    };

    socket.on('re-replication', handleReReplication);

    return () => socket.off('re-replication', handleReReplication);
  }, []);

  return toasts;
}
