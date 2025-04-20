import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
  reactivarProyecto,
} from '../api/proyectos';
import { CrearProyectoPayload } from '../types/proyecto';

export const useCrearProyecto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CrearProyectoPayload) => crearProyecto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
    },
  });
};

export const useActualizarProyecto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CrearProyectoPayload }) =>
      actualizarProyecto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
    },
  });
};

export const useEliminarProyecto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eliminarProyecto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
    },
  });
};

export const useReactivarProyecto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reactivarProyecto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
    },
  });
};
