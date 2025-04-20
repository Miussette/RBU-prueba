export interface Desarrollador {
  codigoDesarrollador: number;
  nombre: string;
  rut: string;
  correoElectronico: string;
  fechaContratacion: string;
  aniosExperiencia: number;
  registroActivo: boolean;
}
export interface CrearDesarrolladorPayload {
  nombre: string;
  rut: string;
  correoElectronico: string;
  fechaContratacion: string; // formato ISO
  aniosExperiencia: number;
}