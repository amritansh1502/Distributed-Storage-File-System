import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket'; // your modular socket connection

function FileUploader() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');
  const [chunkLogs, setChunkLogs] = useState([]);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
    setStatus('');
    setChunkLogs([]);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setStatus('Uploading...');

    try {
      await axios.post(`${backendURL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Upload started — wait for real-time updates
      setStatus('Upload started. Waiting for chunk updates...');
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('Upload failed');
      setUploading(false);
    }
  };

  // Set up real-time socket listeners
  useEffect(() => {
    socket.on('upload-progress', (data) => {
      setProgress(data.progress);
      setChunkLogs((prev) => [
        ...prev,
        `Chunk ${data.chunk} uploaded to nodes: ${data.replicatedTo.join(', ')}`
      ]);
    });

    socket.on('upload-complete', (data) => {
      setStatus('✅ Upload complete!');
      setProgress(100);
      setUploading(false);
      setChunkLogs((prev) => [
        ...prev,
        `✅ All ${data.totalChunks} chunks uploaded successfully.`
      ]);
    });

    return () => {
      socket.off('upload-progress');
      socket.off('upload-complete');
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 border p-6 rounded-xl shadow-md bg-white max-w-xl mx-auto">
      <input type="file" onChange={handleFileChange} />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {status && <p className="mt-2 font-medium">{status}</p>}

      {chunkLogs.length > 0 && (
        <div className="bg-gray-100 p-3 rounded mt-4 w-full text-sm max-h-60 overflow-y-auto">
          <strong className="block mb-1 text-gray-700">Chunk Logs:</strong>
          <ul className="list-disc pl-4 space-y-1">
            {chunkLogs.map((log, idx) => (
              <li key={idx}>{log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
