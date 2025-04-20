import { useEffect, useState } from 'react';
import { Proyecto, CrearProyectoPayload } from '../types/proyecto';
import {
  useCrearProyecto,
  useActualizarProyecto,
} from '../hooks/useProyectos';

interface Props {
  proyecto?: Proyecto;
  onClose: () => void;
}

export default function FormularioProyecto({ proyecto, onClose }: Props) {
  const esEdicion = !!proyecto;

  const [form, setForm] = useState<CrearProyectoPayload>({
    nombre: '',
    fechaInicio: '',
    fechaTermino: '',
  });

  const crear = useCrearProyecto();
  const actualizar = useActualizarProyecto();

  useEffect(() => {
    if (proyecto) {
      setForm({
        nombre: proyecto.nombre,
        fechaInicio: proyecto.fechaInicio.slice(0, 10),
        fechaTermino: proyecto.fechaTermino.slice(0, 10),
      });
    }
  }, [proyecto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CrearProyectoPayload = {
      nombre: form.nombre,
      fechaInicio: new Date(form.fechaInicio).toISOString(),
      fechaTermino: new Date(form.fechaTermino).toISOString(),
    };

    if (esEdicion && proyecto) {
      actualizar.mutate(
        { id: proyecto.codigoProyecto, data: payload },
        {
          onSuccess: () => {
            console.log('✅ Proyecto actualizado');
            onClose();
          },
          onError: (err) => {
            console.error('❌ Error al actualizar:', err);
            alert('No se pudo actualizar el proyecto');
          },
        }
      );
    } else {
      crear.mutate(payload, {
        onSuccess: () => {
          console.log('✅ Proyecto creado');
          onClose();
        },
        onError: (err) => {
          console.error('❌ Error al crear:', err);
          alert('No se pudo crear el proyecto');
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {esEdicion ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del proyecto"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="date"
            name="fechaInicio"
            value={form.fechaInicio}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="date"
            name="fechaTermino"
            value={form.fechaTermino}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={crear.isPending || actualizar.isPending}
            >
              {esEdicion ? 'Guardar Cambios' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
