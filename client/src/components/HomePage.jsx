import React from 'react';
import { Link } from 'react-router-dom';

import NavBar from './NavBar';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <NavBar />
      <main className="flex-grow flex flex-col items-center justify-center px-6">
        <h1 className="text-5xl font-bold mb-8 text-center">Welcome to Distributed Storage System</h1>
        <section className="max-w-4xl w-full bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-lg">
            <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
              <h3 className="font-semibold mb-2">User Authentication</h3>
              <p>Signup and signin with secure JWT-based authentication.</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
              <h3 className="font-semibold mb-2">File Upload</h3>
              <p>User-specific file upload with chunking and encryption.</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
              <h3 className="font-semibold mb-2">Distributed Storage</h3>
              <p>Replication of files across multiple storage nodes for reliability.</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
              <h3 className="font-semibold mb-2">Node Health Monitoring</h3>
              <p>Real-time monitoring and alerts for node status.</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
              <h3 className="font-semibold mb-2">Secure Downloads</h3>
              <p>File download with access control and encryption.</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
              <h3 className="font-semibold mb-2">Re-Replication on Node Failure</h3>
              <p>Automatic re-replication of file chunks when a storage node fails to ensure data reliability.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
