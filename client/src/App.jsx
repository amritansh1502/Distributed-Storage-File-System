import React from 'react';
import FileUploader from './components/FileUploader';
import DownloadFiles from './components/DownloadFiles';
import ThemeToggle from './components/ThemeToggle';
import NodeDashboard from './components/NodeDashboard';
import ReplicationToast from './components/ReplicationToast';
import useReplicationToasts from './hooks/useReplicationToasts';
import { Toaster } from 'react-hot-toast'; // ✅ Import Toaster

function App() {
  const toasts = useReplicationToasts();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-black dark:bg-gray-900 dark:text-white">
      <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Add this */}
      
      <div className="flex justify-between items-center w-full max-w-xl px-4 mb-6">
        <h1 className="text-3xl font-bold">📁 Distributed Storage System</h1>
        <ThemeToggle />
      </div>
      
      <FileUploader />
      <NodeDashboard/>
      <hr className='my-6' />
      <DownloadFiles />
      <ReplicationToast toasts={toasts} />
    </div>
  );
}

export default App;
