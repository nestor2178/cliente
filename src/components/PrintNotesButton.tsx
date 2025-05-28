import { FC } from "react";

interface Note {
  _id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  completed?: boolean;
}

interface PrintNotesButtonProps {
  notes: Note[];
  buttonLabel?: string;
  className?: string;
}

// Función para escapar contenido HTML
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Función para convertir URLs en enlaces clicables
const linkify = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const escapedText = escapeHtml(text);
  return escapedText.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
};

const PrintNotesButton: FC<PrintNotesButtonProps> = ({
  notes,
  buttonLabel = "Imprimir Todo",
  className = "",
}) => {
  const handlePrintAll = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Lista de Notas</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <link rel="stylesheet" href="/index.css">
        </head>
        <body class="print-container">
          <h1 class="print-title">Lista de Notas</h1>
          <div class="notes-list">
            ${notes
              .map(
                (note) => `
              <div class="print-note mb-4 pb-3 border-bottom">
                <h2 class="note-title h5">
                  ${escapeHtml(note.title)}
                  ${
                    note.completed
                      ? '<span class="badge bg-success ms-2">Completada</span>'
                      : '<span class="badge bg-warning ms-2">Pendiente</span>'
                  }
                </h2>
                <div class="note-content mt-2">
                  ${linkify(note.text)}
                </div>
                <div class="note-meta text-muted small mt-2">
                  <span><strong>Creada:</strong> ${new Date(
                    note.createdAt
                  ).toLocaleString()}</span>
                  <span class="ms-3"><strong>Actualizada:</strong> ${new Date(
                    note.updatedAt
                  ).toLocaleString()}</span>
                  <span class="ms-3"><strong>Autor:</strong> ${escapeHtml(
                    note.username
                  )}</span>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="text-center mt-4">
            <button onclick="window.print()" class="btn btn-primary">
              Imprimir Documento
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <button
      onClick={handlePrintAll}
      className={`btn btn-outline-primary print-button ${className}`}
      aria-label="Imprimir todas las notas"
    >
      <i className="bi bi-printer-fill me-2"></i>
      {buttonLabel}
    </button>
  );
};

export default PrintNotesButton;
