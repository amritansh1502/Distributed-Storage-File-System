import axios from 'axios';

const backendBaseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: backendBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
