import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  crearDesarrollador,
  actualizarDesarrollador,
  eliminarDesarrollador,
  reactivarDesarrollador
} from '../api/desarrolladores';
import { CrearDesarrolladorPayload } from '../types/desarrollador';

export const useCrearDesarrollador = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CrearDesarrolladorPayload) => crearDesarrollador(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['desarrolladores'] });
    }
  });
};

export const useActualizarDesarrollador = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CrearDesarrolladorPayload }) =>
      actualizarDesarrollador(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['desarrolladores'] });
    }
  });
};

export const useEliminarDesarrollador = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eliminarDesarrollador(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['desarrolladores'] });
    }
  });
};

export const useReactivarDesarrollador = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reactivarDesarrollador(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['desarrolladores'] });
    }
  });
};
