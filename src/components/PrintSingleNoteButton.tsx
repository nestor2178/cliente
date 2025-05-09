import React from 'react';

interface Note {
  title: string;
  text: string;
  userId: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  username: string;
}

interface Props {
  note: Note;
  users: User[];
}

const PrintSingleNoteButton: React.FC<Props> = ({ note, users }) => {
  const { title, text, userId, completed, createdAt, updatedAt } = note;
  const assignedUser = users.find((u) => u.id === userId)?.username || 'Desconocido';

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Nota</title></head>
          <body>
            <h1>${title}</h1>
            <p><strong>Texto:</strong> ${text}</p>
            <p><strong>Usuario:</strong> ${assignedUser}</p>
            <p><strong>Completada:</strong> ${completed ? 'Sí' : 'No'}</p>
            <p><strong>Creada:</strong> ${createdAt}</p>
            <p><strong>Actualizada:</strong> ${updatedAt}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <button
      className="btn btn-outline-primary print-button"
      aria-label="Imprimir nota individual"
      onClick={handlePrint}
    >
      <i className="bi bi-printer-fill me-2"></i>
      Imprimir Nota
    </button>
  );
};

export default PrintSingleNoteButton;
