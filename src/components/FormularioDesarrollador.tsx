import { useEffect, useState } from 'react';
import { Desarrollador, CrearDesarrolladorPayload } from '../types/desarrollador';
import {
  useCrearDesarrollador,
  useActualizarDesarrollador,
} from '../hooks/useDesarrolladores';

interface Props {
  desarrollador?: Desarrollador;
  onClose: () => void;
}

export default function FormularioDesarrollador({ desarrollador, onClose }: Props) {
  const esEdicion = !!desarrollador;

  const [form, setForm] = useState<CrearDesarrolladorPayload>({
    nombre: '',
    rut: '',
    correoElectronico: '',
    fechaContratacion: '',
    aniosExperiencia: 0,
  });

  const crear = useCrearDesarrollador();
  const actualizar = useActualizarDesarrollador();

  useEffect(() => {
    if (desarrollador) {
      setForm({
        nombre: desarrollador.nombre,
        rut: desarrollador.rut,
        correoElectronico: desarrollador.correoElectronico,
        fechaContratacion: desarrollador.fechaContratacion.slice(0, 10),
        aniosExperiencia: desarrollador.aniosExperiencia,
      });
    }
  }, [desarrollador]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'aniosExperiencia' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CrearDesarrolladorPayload = {
      ...form,
      fechaContratacion: new Date(form.fechaContratacion).toISOString(),
    };

    if (esEdicion && desarrollador) {
      actualizar.mutate(
        { id: desarrollador.codigoDesarrollador, data: payload },
        {
          onSuccess: () => {
            console.log('✅ Actualización exitosa');
            onClose();
          },
          onError: (error) => {
            console.error('❌ Error al actualizar:', error);
            alert('Ocurrió un error al actualizar');
          },
        }
      );
    } else {
      crear.mutate(payload, {
        onSuccess: () => {
          console.log('✅ Creación exitosa');
          onClose();
        },
        onError: (error) => {
          console.error('❌ Error al crear:', error);
          alert('Ocurrió un error al crear');
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {esEdicion ? 'Editar Desarrollador' : 'Nuevo Desarrollador'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre Completo"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="rut"
            value={form.rut}
            onChange={handleChange}
            placeholder="RUT"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="email"
            name="correoElectronico"
            value={form.correoElectronico}
            onChange={handleChange}
            placeholder="Correo Electronico"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
  type={form.fechaContratacion ? 'date' : 'text'}
  name="fechaContratacion"
  value={form.fechaContratacion}
  onChange={handleChange}
  onFocus={(e) => e.target.type = 'date'}
  placeholder="Fecha de contratación"
  className="w-full border px-3 py-2 rounded placeholder-gray-400"
  required
/>
<input
  type={form.aniosExperiencia ? 'number' : 'text'}
  name="aniosExperiencia"
  value={form.aniosExperiencia || ''}
  onChange={handleChange}
  onFocus={(e) => e.target.type = 'number'}
  placeholder="Años de experiencia"
  className="w-full border px-3 py-2 rounded placeholder-gray-400"
  min={0}
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
              className="bg-green-600 text-white px-4 py-2 rounded"
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
