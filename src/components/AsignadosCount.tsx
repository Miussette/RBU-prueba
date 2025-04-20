import { useQuery } from '@tanstack/react-query';
import { getDesarrolladoresPorProyecto } from '../api/proyectos';

interface Props {
  proyectoId: number;
}

export default function AsignadosCount({ proyectoId }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['asignados', proyectoId],
    queryFn: () => getDesarrolladoresPorProyecto(proyectoId),
  });

  if (isLoading) return <span className="text-gray-400">Cargando...</span>;
  if (isError) return <span className="text-red-400">Error</span>;

  return <span>{data?.length ?? 0}</span>;
}
