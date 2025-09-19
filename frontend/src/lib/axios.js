import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://buddy-app-1.onrender.com/api', // Updated to deployed backend
  withCredentials: true, // Include cookies in requests
});
