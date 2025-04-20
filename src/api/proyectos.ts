import { api } from './api';
import { Proyecto, CrearProyectoPayload } from '../types/proyecto';
import { Desarrollador } from '../types/desarrollador';


export const getProyectos = async (): Promise<Proyecto[]> => {
  const res = await api.get('/proyectos');
  return res.data;
};

export const crearProyecto = async (data: CrearProyectoPayload): Promise<Proyecto> => {
  const res = await api.post('/proyectos', data);
  return res.data;
};

export const actualizarProyecto = async (id: number, data: CrearProyectoPayload): Promise<Proyecto> => {
  const res = await api.put(`/proyectos/${id}`, data);
  return res.data;
};

export const eliminarProyecto = async (id: number): Promise<Proyecto> => {
  const res = await api.delete(`/proyectos/${id}`);
  return res.data;
};

export const reactivarProyecto = async (id: number): Promise<Proyecto> => {
  const res = await api.put(`/proyectos/${id}/reactivar`, {});
  return res.data;
};
export const getDesarrolladoresPorProyecto = async (id: number): Promise<Desarrollador[]> => {
  const res = await api.get(`/proyectos/${id}/desarrolladores`);
  return res.data;
};
export const asignarDesarrolladorAProyecto = async (proyectoId: number, desarrolladorId: number) => {
  await api.post(`/proyectos/${proyectoId}/desarrolladores/${desarrolladorId}`);
};

export const desasignarDesarrolladorDeProyecto = async (proyectoId: number, desarrolladorId: number) => {
  await api.delete(`/proyectos/${proyectoId}/desarrolladores/${desarrolladorId}`);
};


