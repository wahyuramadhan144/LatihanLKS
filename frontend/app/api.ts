import axios from 'axios';

const api = axios.create({
  baseURL: 'https://unskilfully-easier-drema.ngrok-free.dev',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Ngrok-Skip-Browser-Warning': 'true',
  },
});

export default api;