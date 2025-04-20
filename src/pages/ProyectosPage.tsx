import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProyectos,
  eliminarProyecto,
  reactivarProyecto,
  getDesarrolladoresPorProyecto,
} from '../api/proyectos';
import { Proyecto } from '../types/proyecto';
import FormularioProyecto from '../components/FormularioProyecto';
import DetalleProyecto from '../components/DetalleProyecto';
import AsignarDesarrolladoresModal from '../components/AsignarDesarrolladoresModal';

export default function ProyectosPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<Proyecto[]>({
    queryKey: ['proyectos'],
    queryFn: getProyectos,
  });

  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'activos' | 'inactivos'>('todos');
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState('');
  const [fechaTerminoFiltro, setFechaTerminoFiltro] = useState('');
  const [minAsignados, setMinAsignados] = useState<number>(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const proyectosPorPagina = 5;

  const [asignaciones, setAsignaciones] = useState<Record<number, number>>({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState<Proyecto | null>(null);
  const [proyectoDetalle, setProyectoDetalle] = useState<Proyecto | null>(null);
  const [proyectoAsignar, setProyectoAsignar] = useState<Proyecto | null>(null);

  useEffect(() => {
    if (!data) return;
    const cargarAsignados = async () => {
      const resultados = await Promise.all(
        data.map((p) =>
          getDesarrolladoresPorProyecto(p.codigoProyecto).then((devs) => ({
            id: p.codigoProyecto,
            count: devs.length,
          }))
        )
      );
      const nuevoMapa: Record<number, number> = {};
      resultados.forEach((res) => {
        nuevoMapa[res.id] = res.count;
      });
      setAsignaciones(nuevoMapa);
    };
    cargarAsignados();
  }, [data]);

  const proyectosFiltrados = data?.filter((p) => {
    const nombreCoincide = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const estadoCoincide =
      estadoFiltro === 'todos' ||
      (estadoFiltro === 'activos' && p.registroActivo) ||
      (estadoFiltro === 'inactivos' && !p.registroActivo);
    const asignados = asignaciones[p.codigoProyecto] ?? 0;
    const asignadosCoincide = asignados >= minAsignados;
    const inicioProyecto = new Date(p.fechaInicio).getTime();
    const terminoProyecto = new Date(p.fechaTermino).getTime();
    const fechaInicioCoincide = fechaInicioFiltro
      ? inicioProyecto >= new Date(fechaInicioFiltro).getTime()
      : true;
    const fechaTerminoCoincide = fechaTerminoFiltro
      ? terminoProyecto <= new Date(fechaTerminoFiltro).getTime()
      : true;

    return (
      nombreCoincide &&
      estadoCoincide &&
      asignadosCoincide &&
      fechaInicioCoincide &&
      fechaTerminoCoincide
    );
  }) ?? [];

  const totalPaginas = Math.ceil(proyectosFiltrados.length / proyectosPorPagina);
  const proyectosPagina = proyectosFiltrados.slice(
    (paginaActual - 1) * proyectosPorPagina,
    paginaActual * proyectosPorPagina
  );

  const refetchAsignaciones = async () => {
    if (!data) return;
    const resultados = await Promise.all(
      data.map((p) =>
        getDesarrolladoresPorProyecto(p.codigoProyecto).then((devs) => ({
          id: p.codigoProyecto,
          count: devs.length,
        }))
      )
    );
    const nuevoMapa: Record<number, number> = {};
    resultados.forEach((res) => {
      nuevoMapa[res.id] = res.count;
    });
    setAsignaciones(nuevoMapa);
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Eliminar proyecto?')) {
      await eliminarProyecto(id);
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
    }
  };

  const handleReactivar = async (id: number) => {
    if (confirm('¿Reactivar proyecto?')) {
      await reactivarProyecto(id);
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
    }
  };

  if (isLoading) return <div className="p-4">Cargando...</div>;
  if (isError) return <div className="p-4 text-red-500">Error al cargar los datos</div>;

  return (
    <div className="overflow-x-auto rounded shadow border border-gray-300 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Nuevo Proyecto
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6 flex-wrap">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Buscar por nombre</label>
          <input
            type="text"
            placeholder="Ej: Proyecto A"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-3 py-1 border rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Estado</label>
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value as 'todos' | 'activos' | 'inactivos')}
            className="px-3 py-1 border rounded-md"
          >
            <option value="todos">Todos</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Fecha de inicio desde</label>
          <input
            type="date"
            value={fechaInicioFiltro}
            onChange={(e) => setFechaInicioFiltro(e.target.value)}
            className="px-3 py-1 border rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Fecha de término hasta</label>
          <input
            type="date"
            value={fechaTerminoFiltro}
            onChange={(e) => setFechaTerminoFiltro(e.target.value)}
            className="px-3 py-1 border rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Mín. desarrolladores asignados</label>
          <input
            type="number"
            min={0}
            value={minAsignados}
            onChange={(e) => setMinAsignados(Number(e.target.value))}
            className="px-3 py-1 border rounded-md w-36"
          />
        </div>
        <div className="flex flex-col justify-end">
          <button
            onClick={() => {
              setBusqueda('');
              setEstadoFiltro('todos');
              setFechaInicioFiltro('');
              setFechaTerminoFiltro('');
              setMinAsignados(0);
            }}
            className="bg-gray-300 hover:bg-gray-400 text-black text-sm px-4 py-[6px] rounded h-10"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-center">Nombre</th>
            <th className="px-4 py-2 text-center">Inicio</th>
            <th className="px-4 py-2 text-center">Término</th>
            <th className="px-4 py-2 text-center">Asignados</th>
            <th className="px-4 py-2 text-center">Estado</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {proyectosPagina.map((proyecto) => (
            <tr key={proyecto.codigoProyecto}>
              <td className="px-4 py-2 text-left">{proyecto.nombre}</td>
              <td className="px-4 py-2 text-center">
                {new Date(proyecto.fechaInicio).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-center">
                {new Date(proyecto.fechaTermino).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-center">{asignaciones[proyecto.codigoProyecto] ?? 0}</td>
              <td className="px-4 py-2 text-center">
                {proyecto.registroActivo ? 'Activo' : 'Inactivo'}
              </td>
              <td className="px-4 py-2 text-center">
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => setProyectoEditando(proyecto)}
                  >
                    Editar
                  </button>
                  {proyecto.registroActivo ? (
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      onClick={() => handleEliminar(proyecto.codigoProyecto)}
                    >
                      Eliminar
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                      onClick={() => handleReactivar(proyecto.codigoProyecto)}
                    >
                      Reactivar
                    </button>
                  )}
                  <button
                    className="bg-purple-600 text-white px-2 py-1 rounded text-sm"
                    onClick={() => setProyectoDetalle(proyecto)}
                  >
                    Ver detalles
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => setProyectoAsignar(proyecto)}
                  >
                    Gestionar
                  </button>
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
        {Array.from({ length: totalPaginas }, (_, i) => (
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

      {/* Formularios y modales */}
      {mostrarFormulario && <FormularioProyecto onClose={() => setMostrarFormulario(false)} />}
      {proyectoEditando && (
        <FormularioProyecto proyecto={proyectoEditando} onClose={() => setProyectoEditando(null)} />
      )}
      {proyectoDetalle && (
        <DetalleProyecto proyecto={proyectoDetalle} onClose={() => setProyectoDetalle(null)} />
      )}
      {proyectoAsignar && (
        <AsignarDesarrolladoresModal
          proyecto={proyectoAsignar}
          onClose={() => setProyectoAsignar(null)}
          refetchAsignaciones={refetchAsignaciones}
        />
      )}
    </div>
  );
}
