import { useEffect, useState } from 'react';
import { Proyecto } from '../types/proyecto';
import { getDesarrolladoresPorProyecto } from '../api/proyectos';
import { Desarrollador } from '../types/desarrollador';

interface Props {
  proyecto: Proyecto;
  onClose: () => void;
}

export default function DetalleProyecto({ proyecto, onClose }: Props) {
  const [asignados, setAsignados] = useState<Desarrollador[]>([]);

  useEffect(() => {
    const cargar = async () => {
      const lista = await getDesarrolladoresPorProyecto(proyecto.codigoProyecto);
      setAsignados(lista);
    };
    cargar();
  }, [proyecto]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Proyecto: {proyecto.nombre}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
          Inicio: {new Date(proyecto.fechaInicio).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Término: {new Date(proyecto.fechaTermino).toLocaleDateString()}
        </p>

        <div>
          <h3 className="text-md font-semibold text-gray-700 dark:text-white mb-2">
            Asignaciones
          </h3>
          {asignados.length === 0 ? (
            <p className="text-sm text-gray-500">No hay desarrolladores asignados.</p>
          ) : (
            <ul className="space-y-2">
            {asignados.map((dev) => (
              <li
                key={dev.codigoDesarrollador}
                className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm text-gray-900 dark:text-white"
              >
                <div className="font-medium">{dev.nombre}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{dev.correo}</div>
                {dev.fechaAsignacion && (
                  <div className="text-xs text-gray-500">
                    Asignado desde: {new Date(dev.fechaAsignacion).toLocaleDateString()}
                  </div>
                )}
              </li>
            ))}
          </ul>
          
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
