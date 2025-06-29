import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DownloadFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(backendURL + '/api/files', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(response.data.files);
        setLoading(false);
      } catch (err) {
        setError('Failed to load files');
        setLoading(false);
      }
    };
    fetchFiles();
  }, [backendURL]);

  const handleDownload = async (fileId, originalName) => {
    try {
      const token = localStorage.getItem('token');
      const url = backendURL + '/api/download/' + fileId;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Download failed');
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      alert('Failed to download file');
    }
  };

  if (loading) return <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading files...</p>;
  if (error) return <p className="text-lg font-semibold text-red-600 dark:text-red-400">{error}</p>;

  return (
    <div className="flex flex-col items-center gap-6 border p-6 sm:p-8 rounded-xl shadow-lg bg-white dark:bg-gray-800 max-w-full sm:max-w-xl mx-auto mt-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Available Files for Download</h2>
      {files.length === 0 ? (
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">No files available for download.</p>
      ) : (
        <ul className="w-full space-y-4">
          {files.map((file) => (
            <li key={file._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 dark:border-gray-600 pb-3">
              <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 break-words mb-2 sm:mb-0 max-w-full truncate">{file.originalName}</span>
              <button
                className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition self-start sm:self-auto"
                onClick={() => handleDownload(file._id, file.originalName)}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DownloadFiles;
