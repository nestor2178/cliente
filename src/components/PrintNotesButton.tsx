import { FC } from "react";
// Asegúrate de que la ruta de importación sea correcta según la ubicación de tu archivo de utilidades.
// Si, por ejemplo, creaste 'textFormatters.ts' en 'src/utils/', esta ruta sería correcta:
import {
  escapeHtml,
  linkifyForPrintHTML,
} from ".././features/utils/escapeHtml";

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

const PrintNotesButton: FC<PrintNotesButtonProps> = ({
  notes,
  buttonLabel = "Imprimir Todo",
  className = "",
}) => {
  const handlePrintAll = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Por favor, permite las ventanas emergentes para imprimir.");
      return;
    }

    // Construir el contenido HTML para la ventana de impresión
    const notesHtml = notes
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
              ${linkifyForPrintHTML(note.text)}
            </div>
            <div class="note-meta text-muted small mt-2">
              <span><strong>Creada:</strong> ${new Date(
                note.createdAt
              ).toLocaleString("es-CO")}</span>
              <span class="ms-3"><strong>Actualizada:</strong> ${new Date(
                note.updatedAt
              ).toLocaleString("es-CO")}</span>
              <span class="ms-3"><strong>Autor:</strong> ${escapeHtml(
                note.username
              )}</span>
            </div>
          </div>
        `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lista de Notas</title>
          <link 
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
            rel="stylesheet" 
            integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" 
            crossorigin="anonymous">
          <style>
            body { 
              font-family: sans-serif; 
              margin: 20px; 
            }
            .print-container { 
              /* Puedes añadir estilos específicos para la página de impresión aquí */
            }
            .print-title { 
              text-align: center; 
              margin-bottom: 20px; 
              border-bottom: 1px solid #dee2e6;
              padding-bottom: 10px;
            }
            .print-note {
              /* Estilos para cada nota individual en la impresión */
            }
            .note-title {
              font-weight: bold;
            }
            .note-content {
              white-space: pre-wrap; /* Para respetar saltos de línea y espacios */
              margin-top: 0.5rem;
              margin-bottom: 0.5rem;
            }
            .note-meta {
              font-size: 0.85em;
            }
            @media print {
            .no-print { /* Clase para ocultar el botón de imprimir en la propia impresión */
              display: none !important;}
            }
          </style>
        </head>
        <body class="print-container">
          <h1 class="print-title">Lista de Notas</h1>
          <div class="notes-list">
            ${notesHtml}
          </div>
          <div class="text-center mt-4 no-print">
            <button onclick="window.print()" class="btn btn-primary">
              Imprimir Documento
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close(); // Necesario para que la carga de la página finalice
    // Algunas personas añaden un pequeño retraso antes de llamar a print()
    // para asegurar que el contenido y estilos se carguen, pero a menudo no es necesario.
    // setTimeout(() => printWindow.print(), 500);
  };

  return (
    <button
      onClick={handlePrintAll}
      className={`btn btn-outline-primary print-button ${className}`}
      aria-label="Imprimir todas las notas"
    >
      {/* Puedes usar un ícono si lo tienes configurado con FontAwesome o similar */}
      {/* <FontAwesomeIcon icon={faPrint} className="me-2" /> */}
      <i className="bi bi-printer-fill me-2"></i>
      {/* Asumo que usas Bootstrap Icons por esta clase */}
      {buttonLabel}
    </button>
  );
};

export default PrintNotesButton;
