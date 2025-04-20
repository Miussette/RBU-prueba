import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDesarrolladores } from '../api/desarrolladores';
import { Desarrollador } from '../types/desarrollador';
import { useEffect, useState } from 'react';
import FormularioDesarrollador from '../components/FormularioDesarrollador';
import {
  useEliminarDesarrollador,
  useReactivarDesarrollador,
} from '../hooks/useDesarrolladores';
import { getProyectosPorDesarrollador } from '../api/asignaciones'; 
import DetalleDesarrollador from '../components/DetalleDesarrollador';

export default function DesarrolladoresPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<Desarrollador[]>({
    queryKey: ['desarrolladores'],
    queryFn: getDesarrolladores,
  });

  const eliminar = useEliminarDesarrollador();
  const reactivar = useReactivarDesarrollador();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [desarrolladorEditando, setDesarrolladorEditando] = useState<Desarrollador | null>(null);
  const [desarrolladorDetalle, setDesarrolladorDetalle] = useState<Desarrollador | null>(null);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'activos' | 'inactivos'>('todos');
  const [experienciaMinima, setExperienciaMinima] = useState(0);
  const [proyectosMinimos, setProyectosMinimos] = useState(0);
  const [asignaciones, setAsignaciones] = useState<Record<number, number>>({});

  //Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const desarrolladoresPorPagina = 6;

  useEffect(() => {
    const cargarAsignaciones = async () => {
      if (!data) return;
      const resultados = await Promise.all(
        data.map(async (d) => {
          const proyectos = await getProyectosPorDesarrollador(d.codigoDesarrollador);
          return { id: d.codigoDesarrollador, count: proyectos.length };
        })
      );

      const mapa: Record<number, number> = {};
      resultados.forEach((res) => {
        mapa[res.id] = res.count;
      });

      setAsignaciones(mapa);
    };

    cargarAsignaciones();
  }, [data]);

  const desarrolladoresFiltrados = data?.filter((dev) => {
    const nombreCoincide = dev.nombre.toLowerCase().includes(busqueda.toLowerCase());

    const estadoCoincide =
      estadoFiltro === 'todos' ||
      (estadoFiltro === 'activos' && dev.registroActivo) ||
      (estadoFiltro === 'inactivos' && !dev.registroActivo);

    const experienciaCoincide = dev.aniosExperiencia >= experienciaMinima;
    const cantidadProyectos = asignaciones[dev.codigoDesarrollador] ?? 0;
    const proyectosCoincide = cantidadProyectos >= proyectosMinimos;
   

    return (
      nombreCoincide && estadoCoincide && experienciaCoincide && proyectosCoincide
    );
  });

  const totalPaginas = Math.ceil((desarrolladoresFiltrados?.length ?? 0) / desarrolladoresPorPagina);

  const desarrolladoresPagina = desarrolladoresFiltrados?.slice(
    (paginaActual - 1) * desarrolladoresPorPagina,
    paginaActual * desarrolladoresPorPagina
  );

  const handleEliminar = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este desarrollador?')) {
      eliminar.mutate(id);
    }
  };

  const handleReactivar = (id: number) => {
    if (confirm('¿Reactivar este desarrollador?')) {
      reactivar.mutate(id);
    }
  };

  if (isLoading) return <div className="p-4">Cargando...</div>;
  if (isError) return <div className="p-4 text-red-500">Error al cargar los datos</div>;

  return (
    <div className="overflow-x-auto rounded shadow border border-gray-300 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Desarrolladores</h1>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Nuevo Desarrollador
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
  {/* Nombre */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label>
    <input
      type="text"
      placeholder="Ej: María"
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      className="px-3 py-1 border rounded-md"
    />
  </div>

  {/* Estado */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1"> Estado</label>
    <select
      value={estadoFiltro}
      onChange={(e) =>
        setEstadoFiltro(e.target.value as 'todos' | 'activos' | 'inactivos')
      }
      className="px-3 py-1 border rounded-md"
    >
      <option value="todos">Todos</option>
      <option value="activos">Activos</option>
      <option value="inactivos">Inactivos</option>
    </select>
  </div>

  {/*Experiencia mínima */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Años de experiencia</label>
    <input
      type="number"
      min={0}
      value={experienciaMinima}
      onChange={(e) => setExperienciaMinima(Number(e.target.value))}
      className="px-3 py-1 border rounded-md"
    />
  </div>

  {/*Proyectos mínimos */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Proyectos asignados</label>
    <input
      type="number"
      min={0}
      value={proyectosMinimos}
      onChange={(e) => setProyectosMinimos(Number(e.target.value))}
      className="px-3 py-1 border rounded-md"
    />
    </div>
        <button
          onClick={() => {
            setBusqueda('');
            setEstadoFiltro('todos');
            setExperienciaMinima(0);
            setProyectosMinimos(0);
          }}
          className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-1 rounded mt-6"
        >
          Limpiar filtros
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-sm text-gray-700">Nombre Completo</th>
            <th className="px-4 py-2 text-left font-semibold text-sm text-gray-700">RUT</th>
            <th className="px-4 py-2 text-left font-semibold text-sm text-gray-700">Correo Electronico</th>
            <th className="px-4 py-2 text-left font-semibold text-sm text-gray-700">Fecha Contratación</th>
            <th className="px-4 py-2 text-left font-semibold text-sm text-gray-700">Años Experiencia</th>
            <th className="px-4 py-2 text-left font-semibold text-sm text-gray-700">Proyectos Asignados</th>
            <th className="px-4 py-2 text-left font-semibold text-sm text-gray-700">Estado</th>
            <th className="px-4 py-2 text-center font-semibold text-sm text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {desarrolladoresPagina?.map((dev) => (
            <tr key={dev.codigoDesarrollador} className="hover:bg-gray-50">
              <td className="px-4 py-2">{dev.nombre}</td>
              <td className="px-4 py-2">{dev.rut}</td>
              <td className="px-4 py-2">{dev.correoElectronico}</td>
              <td className="px-4 py-2 text-center">
                {new Date(dev.fechaContratacion).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-center">{dev.aniosExperiencia}</td>
              <td className="px-4 py-2 text-center">{asignaciones[dev.codigoDesarrollador] ?? 0}</td>
              <td className="px-4 py-2">{dev.registroActivo ? 'Activo' : 'Inactivo'}</td>
              <td className="px-4 py-2 text-center">
                <div className="flex gap-2 justify-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => setDesarrolladorEditando(dev)}
                  >
                    Editar
                  </button>
                  <button
  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
  onClick={() => setDesarrolladorDetalle(dev)}
>
  Ver detalles
</button>
                  {dev.registroActivo ? (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      onClick={() => handleEliminar(dev.codigoDesarrollador)}
                    >
                      Eliminar
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      onClick={() => handleReactivar(dev.codigoDesarrollador)}
                    >
                      Reactivar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ←
        </button>

        {[...Array(totalPaginas)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPaginaActual(i + 1)}
            className={`px-3 py-1 border rounded ${
              paginaActual === i + 1 ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          →
        </button>
      </div>

      {/* Formularios */}
      {mostrarFormulario && (
        <FormularioDesarrollador onClose={() => setMostrarFormulario(false)} />
      )}

      {desarrolladorEditando && (
        <FormularioDesarrollador
          desarrollador={desarrolladorEditando}
          onClose={() => setDesarrolladorEditando(null)}
        />
      )}
      {desarrolladorDetalle && (
  <DetalleDesarrollador
    desarrollador={desarrolladorDetalle}
    onClose={() => setDesarrolladorDetalle(null)}
  />
)}
    </div>
  );
}
