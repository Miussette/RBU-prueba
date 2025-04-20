import { Desarrollador, CrearDesarrolladorPayload } from '../types/desarrollador';
import { api } from './api';

export const getDesarrolladores = async (): Promise<Desarrollador[]> => {
  const res = await api.get('/desarrolladores');
  return res.data;
};

export const getDesarrollador = async (id: number): Promise<Desarrollador> => {
  const res = await api.get(`/desarrolladores/${id}`);
  return res.data;
};

export const crearDesarrollador = async (data: CrearDesarrolladorPayload): Promise<Desarrollador> => {
  const res = await api.post('/desarrolladores', data);
  return res.data;
};

export const actualizarDesarrollador = async (id: number, data: CrearDesarrolladorPayload): Promise<Desarrollador> => {
  const res = await api.put(`/desarrolladores/${id}`, data);
  return res.data;
};

export const eliminarDesarrollador = async (id: number): Promise<Desarrollador> => {
  const res = await api.delete(`/desarrolladores/${id}`);
  return res.data;
};

export const reactivarDesarrollador = async (id: number): Promise<Desarrollador> => {
  const res = await api.put(`/desarrolladores/${id}/reactivar`, {});
  return res.data;
};
