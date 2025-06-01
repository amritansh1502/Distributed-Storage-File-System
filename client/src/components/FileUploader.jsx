import React, { useState } from 'react';
import axios from 'axios';

function FileUploader() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const backendURL = import.meta.env.VITE_BACKEND_URL;

const handleUpload = async () => {
  if (!file) return alert('Please select a file');

  const formData = new FormData();
  formData.append('file', file);
  setUploading(true);
  setStatus('Uploading...');

  try {
    const res = await axios.post(`${backendURL}/api/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const fileId = res.data.fileId || res.data._id;
    pollStatus(fileId);
  } catch (err) {
    console.error('Upload error:', err);
    setStatus('Upload failed');
    setUploading(false);
  }
};

const pollStatus = async (fileId) => {
  const interval = setInterval(async () => {
    try {
      const res = await axios.get(`${backendURL}/api/status/${fileId}`);
      setProgress(res.data.progress);
      if (res.data.status === 'complete') {
        clearInterval(interval);
        setStatus('Upload complete!');
        setUploading(false);
      }
    } catch (err) {
      console.error('Polling error:', err);
      clearInterval(interval);
      setStatus('Error fetching status');
    }
  }, 1000);
};


  return (
    <div className="flex flex-col items-center gap-4 border p-6 rounded-xl shadow-md bg-white">
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
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {status && <p className="mt-2 font-medium">{status}</p>}
    </div>
  );
}

export default FileUploader;


