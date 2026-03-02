export type Worker = {
  nombre: string;
  curp: string;
  ocupacion: string;
  puesto: string;
};

export type SharedData = {
  nombreCurso: string;
  duracionEnHoras: number;
  areaTematica: string;
  startDate: string;
  endDate: string;
  nombreRazonSocialEmpresa: string;
  rfc: string;
  instructor: string;
  patron?: string;
  representanteTrabajadores?: string;
};

export type CourseState = {
  nombreCurso: string;
  duracionEnHoras: number;
  areaTematica: string;
  startDate: Date | null;
  endDate: Date | null;
  instructor: string;
  patron: string;
  representanteTrabajadores: string;
  nombreRazonSocialEmpresa: string;
  rfc: string;
};

export type WorkerErrors = { curp?: string };
export type CourseErrors = { rfc?: string };
