import React from 'react';
import FileUploader from './components/FileUploader';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-black">
      <h1 className="text-3xl font-bold mb-6">📁 Distributed Storage System</h1>
      <FileUploader />
    </div>
  );
}

export default App;
