import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DesarrolladoresPage from './pages/DesarrolladoresPage';
import ProyectosPage from './pages/ProyectosPage';

const queryClient = new QueryClient();

function App() {
  const [vista, setVista] = useState<'proyectos' | 'desarrolladores'>('proyectos');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen w-full bg-background text-foreground">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 py-6">
          {/* Botones de navegación */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setVista('proyectos')}
              className={`px-4 py-2 rounded font-semibold ${
                vista === 'proyectos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Ver Proyectos
            </button>
            <button
              onClick={() => setVista('desarrolladores')}
              className={`px-4 py-2 rounded font-semibold ${
                vista === 'desarrolladores'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Ver Desarrolladores
            </button>
          </div>

          {/* Contenido principal */}
          <div className="w-full overflow-x-auto">
            {vista === 'proyectos' && <ProyectosPage />}
            {vista === 'desarrolladores' && <DesarrolladoresPage />}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;