import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ hideAuthLinks = false }) => {
  return (
<nav className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-md text-white w-full max-w-full">
  <div className="flex space-x-4">
    <Link to="/" className="hover:text-blue-400">Home</Link>
    {!hideAuthLinks && (
      <>
        <Link to="/login" className="hover:text-blue-400">Login</Link>
        <Link to="/signup" className="hover:text-blue-400">Signup</Link>
      </>
    )}
  </div>
  <div className="flex-shrink-0">
    <img
      src="/logo192.png"
      alt="Logo"
      className="h-10 w-10 object-contain"
      style={{ float: 'right' }}
    />
  </div>
</nav>
  );
};

export default NavBar;
