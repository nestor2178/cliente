// frontend/src/types/types.ts

/**
 * Tipos relacionados con las notas
 */
export type NoteStatus = 'Abierta' | 'Completada' | 'En progreso' | 'Archivada';
export interface Note {
  _id: string; // Antes: ReactNode
  id: string;
  title: string;
  text: string;
  status: NoteStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  userId: string;
  completed: boolean;
  username?: string; // Opcional y tipado correctamente
  tags?: string[];
  priority?: 'Baja' | 'Media' | 'Alta';
}

/**
 * Tipos para las respuestas de la API
 */
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export type NotesResponse = ApiResponse<{
  entities: Record<string, Note>;
  ids: string[];
}>;

/**
 * Tipos para los formularios de notas
 */
export interface NoteFormValues {
  title: string;
  text: string;
  status: NoteStatus;
  assignedTo?: string;
  tags?: string[];
  priority?: 'Baja' | 'Media' | 'Alta';
}

/**
 * Tipos para autenticación y usuarios
 */
export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

/**
 * Tipos para las props de los componentes comunes
 */
export interface PrintButtonProps {
  note: Note;
  currentUser: string;
  isAdmin: boolean;
  className?: string;
}

/**
 * Tipos para los parámetros de las rutas
 */
export type RouteParams = {
  noteId?: string;
  userId?: string;
  filter?: string;
};