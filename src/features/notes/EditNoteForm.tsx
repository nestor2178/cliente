import { useState, useEffect } from "react";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Note {
  id: string;
  user: string;
  title: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  ticket?: string;
}

interface User {
  id: string;
  username: string;
}

interface FetchBaseQueryError {
  status: number;
  data?: {
    message?: string;
  };
}

interface EditNoteFormProps {
  note: Note;
  users: User[];
}

const EditNoteForm = ({ note, users }: EditNoteFormProps) => {
  const { isManager, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [completed, setCompleted] = useState(note.completed);
  const [userId, setUserId] = useState(note.user);

  const [updateNote, { isLoading, isSuccess, isError, error }] = useUpdateNoteMutation();
  const [deleteNote, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] =
    useDeleteNoteMutation();

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      navigate("/dash/notes");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value);
  const onCompletedChanged = () => setCompleted((prev) => !prev);
  const onUserIdChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setUserId(e.target.value);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (canSave) {
      try {
        await updateNote({ id: note.id, user: userId, title, text, completed }).unwrap();
      } catch (err) {
        console.error("Failed to update note:", err);
      }
    }
  };

  const onDeleteNoteClicked = async () => {
    if (window.confirm("¿Estás seguro de eliminar esta nota?")) {
      try {
        await deleteNote(note.id).unwrap();
      } catch (err) {
        console.error("Error al eliminar la nota:", err);
      }
    }
  };

  const created = new Date(note.createdAt).toLocaleString("es-CO");
  const updated = new Date(note.updatedAt).toLocaleString("es-CO");

  const options = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  ));

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const errContent = (() => {
    if (error && "data" in error) {
      const fetchError = error as FetchBaseQueryError;
      return fetchError.data?.message ?? "Error al actualizar la nota";
    } else if (delerror && "data" in delerror) {
      const fetchDelError = delerror as FetchBaseQueryError;
      return fetchDelError.data?.message ?? "Error al eliminar la nota";
    }
    return "";
  })();

  const handlePrint = async () => {
    const element = document.getElementById("printable-note");
    if (!element) return;

    // Clona el contenido y lo inserta fuera del viewport para impresión
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = "absolute";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";
    clone.style.display = "block";
    document.body.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Nota_${note.ticket || note.id.slice(0, 8)}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    } finally {
      document.body.removeChild(clone);
    }
  };

  return (
    <div className="edit-note-container">
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Editar Nota #{note.ticket || note.id.slice(0, 8)}</h2>
          <div className="form__action-buttons">
            <button
              className={`icon-button ${!canSave ? "icon-button--disabled" : ""}`}
              title="Guardar"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>

            {(isManager || isAdmin) && (
              <button
                className="icon-button icon-button--danger"
                title="Eliminar"
                onClick={onDeleteNoteClicked}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            )}

            <button className="icon-button" title="Imprimir" onClick={handlePrint}>
              <FontAwesomeIcon icon={faPrint} />
            </button>
          </div>
        </div>

        <div className="form__grid">
          <div className="form__group">
            <label className="form__label" htmlFor="note-title">
              Título:
            </label>
            <input
              className={`form__input ${validTitleClass}`}
              id="note-title"
              type="text"
              value={title}
              onChange={onTitleChanged}
            />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="note-text">
              Texto:
            </label>
            <textarea
              className={`form__input form__input--text ${validTextClass}`}
              id="note-text"
              value={text}
              onChange={onTextChanged}
              rows={8}
            />
          </div>

          <div className="form__group">
            <label className="form__label form__checkbox-container" htmlFor="note-completed">
              TRABAJO COMPLETADO:
              <input
                className="form__checkbox"
                id="note-completed"
                type="checkbox"
                checked={completed}
                onChange={onCompletedChanged}
              />
            </label>
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="note-username">
              ASIGNAR A:
            </label>
            <select
              id="note-username"
              className="form__select"
              value={userId}
              onChange={onUserIdChanged}
            >
              <option value="">Seleccionar usuario</option>
              {options}
            </select>
          </div>

          <div className="form__meta">
            <p>
              <strong>Creada:</strong> {created}
            </p>
            <p>
              <strong>Actualizada:</strong> {updated}
            </p>
          </div>
        </div>
      </form>

      {/* ✅ Área oculta imprimible */}
      <div
        id="printable-note"
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          padding: "20px",
          fontFamily: "Arial",
          backgroundColor: "#fff",
          color: "#000",
          width: "800px",
        }}
      >
        <h2>Nota #{note.ticket || note.id.slice(0, 8)}</h2>
        <p><strong>Título:</strong> {title}</p>
        <p><strong>Texto:</strong></p>
        <p>{text}</p>
        <p>
          <strong>Asignado a:</strong> {users.find((u) => u.id === userId)?.username || "Desconocido"}
        </p>
        <p><strong>Completada:</strong> {completed ? "Sí" : "No"}</p>
        <p><strong>Creada:</strong> {created}</p>
        <p><strong>Actualizada:</strong> {updated}</p>
      </div>
    </div>
  );
};

export default EditNoteForm;
