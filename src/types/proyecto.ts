export interface Proyecto {
    codigoProyecto: number;
    nombre: string;
    fechaInicio: string;
    fechaTermino: string;
    registroActivo: boolean;
  }
  
  export interface CrearProyectoPayload {
    nombre: string;
    fechaInicio: string;
    fechaTermino: string;
  }
  