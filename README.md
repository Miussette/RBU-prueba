# Prueba Técnica - RBU

Aplicación web construida con React + TypeScript + TailwindCSS que permite gestionar proyectos y desarrolladores, incluyendo asignaciones, filtros avanzados, paginación, edición, y más.

## Aplicación desplegada

La aplicación está desplegada en Vercel y puede ser accedida desde el siguiente enlace:

[https://rbu-prueba-1.vercel.app](https://rbu-prueba-1.vercel.app)

Esto permite visualizar y probar todas las funcionalidades directamente desde el navegador, sin necesidad de instalar nada localmente.

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
- Deploy: Vercel

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
- TailwindCSS fue elegido por su velocidad para prototipar UI sin necesidad de archivos CSS externos.
- La separación de responsabilidades se mantiene entre api/, pages/, components/, y hooks/.
- Se utilizó React Query para facilitar el manejo del caché y estado de datos

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
- No se incluye autenticación, ya que no fue solicitada en los requisitos.
- El deploy usa variables de entorno privadas a través de Vercel (VITE_API_TOKEN).

# RBU-prueba
