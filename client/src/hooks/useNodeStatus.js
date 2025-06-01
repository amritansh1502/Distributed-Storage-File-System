import { useEffect, useState } from 'react';
import socket from '../socket';

export default function useNodeStatus() {
  const [chunks, setChunks] = useState([]);
  const [nodes, setNodes] = useState({});
  const [activeNodes, setActiveNodes] = useState(new Set());
  const [filter, setFilter] = useState('');

  useEffect(() => {
    socket.on('chunkProgress', (data) => {
      setChunks((prev) => [...prev, data]);

      setNodes((prevNodes) => {
        const updated = { ...prevNodes };
        data.nodes.forEach((node) => {
          if (!updated[node]) updated[node] = [];
          updated[node].push({ name: data.chunkName, file: data.fileName });
        });
        return updated;
      });

      setActiveNodes((prev) => {
        const newSet = new Set(prev);
        data.nodes.forEach((node) => newSet.add(node));
        return newSet;
      });
    });

    return () => socket.off('chunkProgress');
  }, []);

  return { chunks, nodes, activeNodes, filter, setFilter };
}
