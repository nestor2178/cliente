import { useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "./notesApiSlice";
import { memo } from "react";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Definir tipos explícitos para las props
interface NoteProps {
  noteId: string; // `noteId` es un string
}

const Note = ({ noteId }: NoteProps) => {
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId],
    }),
  });

  const navigate = useNavigate();

  if (!note) return null;

  const created = new Date(note.createdAt).toLocaleString("es-CO");
  const updated = new Date(note.updatedAt).toLocaleString("es-CO");

  const handleEdit = () => navigate(`/dash/notes/${noteId}`);

  return (
    <>
      {/* Contenido visible en la tabla */}
      <tr className="table__row">
        <td className="table__cell note__status">
          {note.completed ? "Completada" : "Pendiente"}
        </td>
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{updated}</td>
        <td className="table__cell note__title">{note.title}</td>
        <td className="table__cell note__username">{note.username}</td>
        <td className="table__cell note__edit">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    </>
  );
};

// Contenido oculto para impresión (deberías manejarlo en el componente padre)
// O puedes crear un componente separado para esto
export const NotePrintContent = ({ note }: { note: any }) => {
  const created = new Date(note.createdAt).toLocaleString("es-CO");
  const updated = new Date(note.updatedAt).toLocaleString("es-CO");

  return (
    <div id={`note-content-${note._id}`} className="note-print hidden">
      <h2>{note.title}</h2>
      <p>{note.text}</p>
      <small>Creada: {created}</small>
      <br />
      <small>Actualizada: {updated}</small>
      <br />
      <small>Autor: {note.username}</small>
      <hr />
    </div>
  );
};

// Memorizar el componente si es necesario, pero puede eliminarse si no se necesita optimización
const memoizedNote = memo(Note);
export default memoizedNote;
