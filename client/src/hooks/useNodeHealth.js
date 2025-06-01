import { useEffect, useState } from 'react';
import socket from '../socket';

export default function useNodeHealth() {
  const [nodeStatus, setNodeStatus] = useState({});

  useEffect(() => {
    socket.on('nodeHealthStatus', (data) => {
      setNodeStatus(data); // { Node-1: true, Node-2: false }
    });

    return () => socket.off('nodeHealthStatus');
  }, []);

  return nodeStatus;
}
