import React from 'react';
import useNodeStatus from '../hooks/useNodeStatus';
import useNodeHealth from '../hooks/useNodeHealth';
import useReplicationToasts from '../hooks/useReplicationToasts';
import ReplicationToast from '../components/ReplicationToast';   
// ...

function NodeDashboard() {
  const nodeStatus = useNodeHealth();
  const { nodes, activeNodes, filter, setFilter } = useNodeStatus();
  const toasts = useReplicationToasts();
  console.log(toasts);

  const filteredNodes = Object.entries(nodes)
    .map(([nodeName, chunkList]) => {
      const filteredChunks = chunkList.filter(chunk =>
        chunk.file.toLowerCase().includes(filter.toLowerCase())
      );
      return [nodeName, filteredChunks];
    })
    .filter(([_, chunks]) => chunks.length > 0);

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-semibold mb-4">📊 Node Replication Dashboard</h2>

      <input
        type="text"
        placeholder="Filter by file name..."
        className="border p-2 rounded w-full mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredNodes.length === 0 && (
          <p className="text-gray-600 col-span-full text-center">
            No nodes or chunks match your filter.
          </p>
        )}

        {filteredNodes.map(([nodeName, chunks]) => {
          const isActive = nodeStatus[nodeName] ?? false;
          return (
            <div
              key={nodeName}
              className={`p-4 border rounded-xl shadow ${
                isActive ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg text-blue-700">{nodeName}</h3>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded ${
                    isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <ul className="text-sm text-gray-800 space-y-1">
                {chunks.map((chunk, idx) => (
                  <li key={chunk.name + idx}>
                    📦 {chunk.name}{' '}
                    <span className="text-xs text-gray-500">({chunk.file})</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* 🍞 Animated Re-replication Toasts */}
      <ReplicationToast toasts={toasts} />
    </div>
  );
}

export default NodeDashboard;
