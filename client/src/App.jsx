import React, { useEffect } from 'react';
import FileUploader from './components/FileUploader';
import DownloadFiles from './components/DownloadFiles';
import NodeDashboard from './components/NodeDashboard';
import ReplicationToast from './components/ReplicationToast';
import useReplicationToasts from './hooks/useReplicationToasts';
import { Toaster } from 'react-hot-toast'; // ✅ Import Toaster

function App() {
  const toasts = useReplicationToasts();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Add this */}
      
      <div className="flex justify-center items-center w-full max-w-xl px-6 py-4 mb-8 bg-gradient-to-r from-blue-700 to-indigo-900 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold drop-shadow-lg select-none text-center">📁 Distributed Storage System</h1>
      </div>
      
      <FileUploader />
      <NodeDashboard/>
      <hr className='my-6 border-gray-700' />
      <DownloadFiles />
      <ReplicationToast toasts={toasts} />
    </div>
  );
}

export default App;
