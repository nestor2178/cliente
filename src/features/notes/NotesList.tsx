import { useGetNotesQuery } from "./notesApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import PrintNotesButton from "../../components/PrintNotesButton";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { memo } from "react";
import { NotePrintContent } from "./Note";

const NotesList = () => {
  const { data: notes, error, isLoading } = useGetNotesQuery("notesList");
  const navigate = useNavigate();

  if (isLoading) return <PulseLoader color={"#FFF"} />;

  if (error) {
    if ("status" in error) {
      return (
        <p className="errmsg">
          {(error.data as { message?: string })?.message ?? "Error desconocido"}
        </p>
      );
    } else if ("message" in error) {
      return <p className="errmsg">{error.message}</p>;
    } else {
      return <p className="errmsg">Ocurrió un error desconocido</p>;
    }
  }

  const { ids, entities } = notes || {};

  if (!ids || !entities) return <p>No se encontraron notas.</p>;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-CO", options);
  };

  const handleEdit = (id: string) => {
    navigate(`/dash/notes/${id}`);
  };

  const tableContent = ids.map((id) => {
    const note = entities[id];
    if (!note) return null;

    const rowStatus = note.completed
      ? "table__row--completed"
      : "table__row--pending";

    return (
      <tr key={id} className={`table__row note ${rowStatus}`}>
        <td className="table__cell note__status">
          {note.completed ? "Completada" : "Pendiente"}
        </td>
        <td className="table__cell note__created">
          {formatDate(note.createdAt)}
        </td>
        <td className="table__cell note__updated">
          {formatDate(note.updatedAt)}
        </td>
        <td className="table__cell note__title">{note.title}</td>
        <td className="table__cell note__username">{note.username}</td>
        <td className="table__cell note__edit">
          <button
            className="icon-button table__button"
            onClick={() => handleEdit(id)}
            title="Editar nota"
            aria-label="Editar nota"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  });

  // Solo notas válidas con título y texto para imprimir
  const notesForPrint = ids
    .map((noteId) => entities[noteId])
    .filter((note) => note && note.title && note.text);

  return (
    <div className="notes-container">
      <div className="flex justify-end mb-4">
        <PrintNotesButton
          notes={notesForPrint}
          buttonLabel="Imprimir Lista de Notas"
          className="print-button"
        />
      </div>

      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th className="table__th">Estado</th>
            <th className="table__th">Creada</th>
            <th className="table__th">Actualizada</th>
            <th className="table__th">Título</th>
            <th className="table__th">Dueño</th>
            <th className="table__th">Acciones</th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>

      {/* Contenido oculto para impresión */}
      <div className="print-area hidden">
        {notesForPrint.map((note) => (
          <NotePrintContent key={note._id} note={note} />
        ))}
      </div>
    </div>
  );
};

export default memo(NotesList);
