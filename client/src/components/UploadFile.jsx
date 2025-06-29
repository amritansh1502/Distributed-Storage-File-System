import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import DownloadFiles from './DownloadFiles';
import NodeDashboard from './NodeDashboard';
import ReplicationToast from './ReplicationToast';
import useReplicationToasts from '../hooks/useReplicationToasts';

import axiosInstance from '../api/axiosConfig';

import NavBar from './NavBar';

const UploadFile = ({ onLogout }) => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const toasts = useReplicationToasts();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axiosInstance.get('/api/files', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setFiles(res.data.files);
      } else {
        setMessage(res.data.error || 'Failed to fetch files');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 w-full max-w-full mx-auto flex flex-col items-center">
      <NavBar hideAuthLinks={true} />
      <h2 className="text-3xl font-bold mb-6">Upload and Download Files</h2>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <FileUploader onUploadSuccess={fetchFiles} />
      <NodeDashboard />
      <hr className="my-6 border-gray-700 w-full" />
      <DownloadFiles files={files} onDownloadError={setMessage} />
      <ReplicationToast toasts={toasts} />
      <button
        onClick={onLogout}
        className="mt-6 bg-red-600 hover:bg-red-700 py-2 px-4 rounded font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default UploadFile;
