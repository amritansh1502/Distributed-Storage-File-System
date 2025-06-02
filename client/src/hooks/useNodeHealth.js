import { useEffect, useState } from 'react';
import socket from '../socket';

export default function useNodeHealth() {
  const [nodeStatus, setNodeStatus] = useState({});

  useEffect(() => {
    socket.on('upload-progress', (data) => {
      // Convert array of nodes to object with true status
      const statusObj = {};
      data.replicatedTo.forEach(node => {
        statusObj[node] = true;
      });
      setNodeStatus(statusObj);
    });

    return () => socket.off('upload-progress');
  }, []);

  return nodeStatus;
}
