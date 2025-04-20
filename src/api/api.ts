import axios from 'axios';

const token = import.meta.env.VITE_API_TOKEN;

export const api = axios.create({
  baseURL: 'https://apipruebas.rbu.cl/api',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
