import { useEffect, useState } from 'react';
import socket from '../socket';

export default function useNodeHealth() {
  const [nodeStatus, setNodeStatus] = useState({});

  useEffect(() => {
    socket.on('nodeHealthStatus', (data) => {
      console.log('useNodeHealth received nodeHealthStatus:', data);
      // data is an array of { nodeId, status, lastSeen }
      const statusObj = {};
      data.forEach(({ nodeId, status }) => {
        const normalizedNodeId = nodeId.toLowerCase();
        statusObj[normalizedNodeId] = status === 'online';
      });
      setNodeStatus(statusObj);
    });

    return () => socket.off('nodeHealthStatus');
  }, []);

  return nodeStatus;
}
