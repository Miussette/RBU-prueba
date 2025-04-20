import { useEffect, useState } from 'react';
import { Proyecto } from '../types/proyecto';
import { Desarrollador } from '../types/desarrollador';
import {
  getDesarrolladores,
  asignarDesarrolladorAProyecto,
  quitarDesarrolladorDeProyecto,
} from '../api/asignaciones';
import { getDesarrolladoresPorProyecto } from '../api/proyectos';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  proyecto: Proyecto;
  onClose: () => void;
  refetchAsignaciones: () => Promise<void>;
}

export default function AsignarDesarrolladoresModal({
  proyecto,
  onClose,
  refetchAsignaciones,
}: Props) {
  const queryClient = useQueryClient();

  const [todos, setTodos] = useState<Desarrollador[]>([]);
  const [asignados, setAsignados] = useState<number[]>([]);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        const [devs, asignadosProyecto] = await Promise.all([
          getDesarrolladores(),
          getDesarrolladoresPorProyecto(proyecto.codigoProyecto),
        ]);

        setTodos(devs);
        const asignadosIds = asignadosProyecto.map((d) => d.codigoDesarrollador);
        setAsignados(asignadosIds);
        setSeleccionados(asignadosIds);
      } catch (err: unknown) {
        console.error(err);
        setMensaje('❌ Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, [proyecto]);

  const toggleSeleccion = (id: number) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGuardar = async () => {
    setIsSaving(true);
    setMensaje('');
  
    const nuevos = seleccionados.filter((id) => !asignados.includes(id));
    const eliminados = asignados.filter((id) => !seleccionados.includes(id));
  
    try {
      await Promise.all([
        ...nuevos.map((id) => asignarDesarrolladorAProyecto(proyecto.codigoProyecto, id)),
        ...eliminados.map((id) => quitarDesarrolladorDeProyecto(proyecto.codigoProyecto, id)),
      ]);
  
      await queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      await queryClient.invalidateQueries({ queryKey: ['asignados', proyecto.codigoProyecto] });
  
      await refetchAsignaciones(); // ✅ Asegura que se ejecute
  
      setMensaje('✅ Cambios guardados correctamente');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      console.error(err);
      setMensaje('❌ Error al guardar cambios');
    } finally {
      setIsSaving(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Asignar desarrolladores a: {proyecto.nombre}
        </h2>

        {isLoading ? (
          <p className="text-gray-500">🔄 Cargando desarrolladores...</p>
        ) : (
          <div className="max-h-[400px] overflow-y-auto border p-3 rounded bg-gray-50 dark:bg-gray-800">
            {todos.map((dev) => {
              const desactivado = !dev.registroActivo;
              return (
                <label
                  key={dev.codigoDesarrollador}
                  className={`block mb-2 ${
                    desactivado ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  title={
                    desactivado
                      ? 'Este desarrollador está inactivo y no puede ser asignado'
                      : ''
                  }
                >
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(dev.codigoDesarrollador)}
                    onChange={() => toggleSeleccion(dev.codigoDesarrollador)}
                    disabled={desactivado}
                    className="mr-2"
                  />
                  {dev.nombre} ({dev.correoElectronico})
                </label>
              );
            })}
          </div>
        )}

        <div className="mt-4 text-sm text-red-500 min-h-[1.5rem]">{mensaje}</div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
