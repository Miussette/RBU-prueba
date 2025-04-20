import { api } from './api';
import { Desarrollador } from '../types/desarrollador';
import { Proyecto } from '../types/proyecto';
/**
 * Obtener todos los desarrolladores
 */
export const getDesarrolladores = async (): Promise<Desarrollador[]> => {
  const res = await api.get('/desarrolladores');
  return res.data;
};

/**
 * Asignar un desarrollador a un proyecto
 */
export const asignarDesarrolladorAProyecto = async (
  proyectoId: number,
  desarrolladorId: number
): Promise<void> => {
  await api.post(`/proyectos/${proyectoId}/desarrolladores/${desarrolladorId}`);
};

// Función para quitar
export const quitarDesarrolladorDeProyecto = async (
  proyectoId: number,
  desarrolladorId: number
): Promise<void> => {
  await api.delete(`/proyectos/${proyectoId}/desarrolladores/${desarrolladorId}`);
};
// api/asignaciones.ts



// Devuelve todos los proyectos asignados a un desarrollador específico
export const getProyectosPorDesarrollador = async (
  idDesarrollador: number
): Promise<Proyecto[]> => {
  const res = await api.get(`/desarrolladores/${idDesarrollador}/proyectos`);
  return res.data;
};
