import React from 'react';
import { Note } from '../../types/types';

interface PrintableNoteProps {
  note: Note;
  currentUser?: string;
  isAdmin?: boolean;
  buttonLabel?: string;
}

const PrintableNote: React.FC<PrintableNoteProps> = ({ 
  note, 
  buttonLabel = "Imprimir"
}) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Nota: ${note.title}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { color: #333; }
            .content { white-space: pre-wrap; margin: 15px 0; }
            .meta { font-size: 0.9em; color: #666; }
          </style>
        </head>
        <body>
          <h1>${note.title}</h1>
          <div class="content">${note.text}</div>
          <div class="meta">
            <p>Estado: ${note.status}</p>
            <p>Creada: ${new Date(note.createdAt).toLocaleString()}</p>
            <p>Actualizada: ${new Date(note.updatedAt).toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      {/* Your existing component JSX */}
      <button onClick={handlePrint}>{buttonLabel}</button>
    </div>
  );
};

export default PrintableNote;
