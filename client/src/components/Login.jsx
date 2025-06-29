import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';



import axiosInstance from '../api/axiosConfig';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosInstance.post('/api/auth/signin', { email, password });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        login(response.data.token);
        navigate('/upload');
      } else {
        setError(response.data.error || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-6 text-center font-bold">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
        <p className="mt-2 text-center">
          <Link to="/" className="text-blue-400 hover:underline">Back to Home</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
