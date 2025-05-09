import { useParams } from 'react-router-dom';
import { useGetNotesQuery } from './notesApiSlice';
import useAuth from '../../hooks/useAuth';
import PrintSingleNoteButton from '../../components/PrintSingleNoteButton';
import { PulseLoader } from 'react-spinners';
import { Note } from '../../types/types';
import ErrorMessage from '../../components/ErrorMessage';
import React from 'react';

const NoteEditView = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const { username: currentUser, isAdmin } = useAuth();
  

  const { 
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetNotesQuery('notesList');

  // Estado para manejar la nota en edición
  const [editableNote, setEditableNote] = React.useState<Partial<Note> | null>(null);

  React.useEffect(() => {
    if (isSuccess && noteId && notes?.entities[noteId]) {
      setEditableNote(notes.entities[noteId]);
    }
  }, [isSuccess, noteId, notes]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader color="#3B82F6" />
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  if (!noteId || !editableNote) {
    return <div className="text-center py-8">Nota no encontrada</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">Editar Nota #{noteId}</h1>
        
        <PrintSingleNoteButton 
          note={editableNote as Note} 
          currentUser={currentUser}
          isAdmin={isAdmin}
        />
      </div>

      {/* Formulario de edición */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Aquí iría tu formulario de edición */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={editableNote.title || ''}
              onChange={(e) => setEditableNote({...editableNote, title: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Contenido</label>
            <textarea
              value={editableNote.text || ''}
              onChange={(e) => setEditableNote({...editableNote, text: e.target.value})}
              rows={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditView;
