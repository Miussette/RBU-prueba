# Prueba Técnica - RBU

Aplicación web construida con React + TypeScript + TailwindCSS que permite gestionar proyectos y desarrolladores, incluyendo asignaciones, filtros avanzados, paginación, edición, y más.

## Demo (opcional)

Puedes probar la aplicación en local siguiendo las instrucciones de abajo. Si tienes un enlace de despliegue (como en Vercel o Netlify), agrégalo aquí:

[Enlace a la demo (si aplica)]()

## Instalación

```bash
git clone https://github.com/Miussette/RBU-prueba.git
cd dev-manager
npm install
npm run dev
```

Luego abre [http://localhost:5173](http://localhost:5173) en tu navegador.

Asegúrate de tener Node.js y npm instalados.

## Arquitectura

- React + TypeScript: estructura modular basada en componentes.
- TailwindCSS: para estilos rápidos, modernos y responsivos.
- React Query: manejo de caché y fetching de datos de forma eficiente.
- Axios: para consumir la API REST.
- API Externa: conexión con API alojada en https://apipruebas.rbu.cl/api.

### Carpetas principales:

```
src/
├── api/                 # Módulos para llamadas HTTP (axios)
├── components/          # Componentes reutilizables (modales, formularios, tablas)
├── hooks/               # Custom hooks para lógica compartida
├── pages/               # Vistas principales (Proyectos, Desarrolladores)
├── types/               # Tipado global TypeScript
```

## Decisiones Técnicas

- Se optó por mantener la lógica en el frontend (sin backend propio) utilizando una API pública.
- La interfaz está dividida por roles (proyectos/desarrolladores) con vistas y filtros adaptados a cada uno.
- Se incluyó paginación, filtros combinables, validaciones y feedback visual para acciones del usuario.

## Funcionalidades principales

- Crear, editar, eliminar y reactivar desarrolladores y proyectos.
- Asignar desarrolladores a proyectos y ver relaciones cruzadas.
- Filtros por nombre, estado, experiencia y fechas.
- Ver detalle de cada desarrollador (proyectos asignados).
- Paginación dinámica y tabla responsive.
- Modo oscuro y estilos adaptativos (Tailwind).

## Consideraciones adicionales

- El formulario valida formatos de RUT (sin puntos) y fechas válidas.
- El sistema de filtros funciona de forma combinada y sin recargar la página.
# RBU-prueba
