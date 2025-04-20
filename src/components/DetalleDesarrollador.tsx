import { useEffect, useState } from 'react';
import { Desarrollador } from '../types/desarrollador';
import { Proyecto } from '../types/proyecto';
import { getProyectosPorDesarrollador } from '../api/asignaciones';

interface Props {
  desarrollador: Desarrollador;
  onClose: () => void;
}

export default function DetalleDesarrollador({ desarrollador, onClose }: Props) {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      const proyectos = await getProyectosPorDesarrollador(desarrollador.codigoDesarrollador);
      setProyectos(proyectos);
      setCargando(false);
    };
    cargar();
  }, [desarrollador]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Proyectos de {desarrollador.nombre}</h2>
        {cargando ? (
          <p>Cargando proyectos...</p>
        ) : proyectos.length === 0 ? (
          <p>No hay proyectos asignados.</p>
        ) : (
          <ul className="list-disc pl-6">
            {proyectos.map((proyecto) => (
              <li key={proyecto.codigoProyecto}>{proyecto.nombre}</li>
            ))}
          </ul>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
