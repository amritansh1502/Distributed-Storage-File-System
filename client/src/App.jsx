import React from 'react';
import FileUploader from './components/FileUploader';
import NodeDashboard from './components/NodeDashboard';
import ReplicationToast from './components/ReplicationToast';
import useReplicationToasts from './hooks/useReplicationToasts';
import { Toaster } from 'react-hot-toast'; // ✅ Import Toaster

function App() {
  const toasts = useReplicationToasts();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-black">
      <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Add this */}
      
      <h1 className="text-3xl font-bold mb-6">📁 Distributed Storage System</h1>
      <FileUploader />
      <hr className='my-6' />
      <NodeDashboard/>
      <ReplicationToast toasts={toasts} />
    </div>
  );
}

export default App;
