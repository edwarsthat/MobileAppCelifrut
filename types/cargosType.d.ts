type PermisosType = {
  [key: string]: string;
};

interface Ventana {
  titulo: string;
  permisos: PermisosType;
  _id: string;
}

export type SeccionType = {
  [key: string]: Ventana;
};

export interface CargoType {
  Cargo: string;
  createdAt: Date;
  'Inventario y Logística': SeccionType;
  Calidad: SeccionType;
  Sistema: SeccionType;
  Indicadores: SeccionType;
  Proceso: SeccionType;
  Comercial: SeccionType;
  'Gestión de cuentas': SeccionType;
  Rol: number;
}
