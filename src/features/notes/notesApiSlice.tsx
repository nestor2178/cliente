import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/ApiSlice";

interface Note {
  _id: string;
  id: string;
  title: string;
  text: string;
  status: 'Abierta' | 'Completada' | 'En progreso' | 'Archivada';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  username: string;
  completed: boolean;
  priority?: 'Baja' | 'Media' | 'Alta';
  tags?: string[];
}

const notesAdapter = createEntityAdapter<Note>({
  sortComparer: (a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1),
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => "/notes",
      transformResponse: (responseData: Note[]) => {
        return notesAdapter.setAll(
          initialState,
          responseData.map(note => ({ ...note, id: note._id }))
        );
      },
      providesTags: (result) => 
        result?.ids 
          ? [
              { type: 'Note', id: 'LIST' },
              ...result.ids.map(id => ({ type: 'Note' as const, id }))
            ]
          : [{ type: 'Note', id: 'LIST' }]
    }),
    getNoteById: builder.query<Note, string>({
      query: (id) => `/notes/${id}`,
      transformResponse: (responseData: Note) => ({
        ...responseData,
        id: responseData._id
      }),
      providesTags: (_result, _error, id) => [{ type: 'Note', id }],
    }),
    addNewNote: builder.mutation({
      query: (initialNote) => ({
        url: '/notes',
        method: 'POST',
        body: initialNote
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }]
    }),
    updateNote: builder.mutation({
      query: (updatedNote) => ({
        url: '/notes',
        method: 'PATCH',
        body: updatedNote
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Note', id: arg.id }]
    }),
    deleteNote: builder.mutation({
      query: (id) => ({
        url: `/notes/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Note', id }]
    })
  }),
});

// Exportar todos los hooks necesarios
export const {
  useGetNotesQuery,
  useGetNoteByIdQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation, // Ahora está disponible
} = notesApiSlice;

// Selectors
const selectNotesResult = notesApiSlice.endpoints.getNotes.select({});

const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data ?? initialState
);

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
} = notesAdapter.getSelectors((state: any) => selectNotesData(state));