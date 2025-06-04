import { useEffect, useState } from 'react';
import socket from '../socket';

export default function useNodeStatus() {
  const [chunks, setChunks] = useState([]);
  const [nodes, setNodes] = useState({});
  const [activeNodes, setActiveNodes] = useState(new Set());
  const [filter, setFilter] = useState('');

  useEffect(() => {
    socket.on('upload-progress', (data) => {
      console.log('useNodeStatus received upload-progress:', data);
      setChunks((prev) => [...prev, data]);

      setNodes((prevNodes) => {
        const updated = { ...prevNodes };
        data.replicatedTo.forEach((node) => {
          if (!updated[node]) updated[node] = [];
          updated[node].push({ name: `chunk-${data.chunk}`, file: data.fileName });
        });
        return updated;
      });

      setActiveNodes((prev) => {
        const newSet = new Set(prev);
        data.replicatedTo.forEach((node) => newSet.add(node));
        return newSet;
      });
    });

    return () => socket.off('upload-progress');
  }, []);

  return { chunks, nodes, activeNodes, filter, setFilter };
}
