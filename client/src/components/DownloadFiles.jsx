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
        const response = await axios.get(backendURL + '/api/files');
        setFiles(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load files');
        setLoading(false);
      }
    };
    fetchFiles();
  }, [backendURL]);

  const handleDownload = (fileId, originalName) => {
    const url = backendURL + '/api/download/' + fileId;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', originalName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Loading files...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col items-center gap-4 border p-6 rounded-xl shadow-md bg-white max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Available Files for Download</h2>
      {files.length === 0 ? (
        <p>No files available for download.</p>
      ) : (
        <ul className="w-full space-y-3">
          {files.map((file) => (
            <li key={file._id} className="flex justify-between items-center border-b pb-2">
              <span>{file.originalName}</span>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
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
