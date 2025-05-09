import { useParams } from 'react-router-dom';
import { useGetNoteByIdQuery } from './notesApiSlice';
import PrintableNote from './PrintableNote';
import useAuth from "../../hooks/useAuth";
import PulseLoader from 'react-spinners/PulseLoader';

const PrintableNoteWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const { username, isAdmin } = useAuth();

  const { 
    data: note,
    isLoading,
    isError,
    isSuccess
  } = useGetNoteByIdQuery(id || '');

  if (isLoading) return <PulseLoader color="#FFF" />;
  if (isError) return <div>Error loading note</div>;
  if (!isSuccess || !note) return <div>Note not found</div>;

  return (
    <PrintableNote 
      note={note} 
      currentUser={username} 
      isAdmin={isAdmin} 
    />
  );
};

export default PrintableNoteWrapper;
