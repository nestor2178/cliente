import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../auth/authSlice';
import SearchForm from '../../components/SearchForm';
import NoteComponent from './Note';

interface SearchCriteria {
    title?: string;
    text?: string;
    startDate?: string;
    endDate?: string;
    completed?: string;
    username?: string;
}

interface Note {
    _id: string;
    title: string;
    text: string;
    username: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

const AdvancedSearch: React.FC = () => {
    const [searchResults, setSearchResults] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const accessToken = useSelector(selectCurrentToken);

    const handleSearch = async (criteria: SearchCriteria) => {
        if (!accessToken) {
            console.error('No se encontró el token. Por favor, inicia sesión nuevamente.');
            setErrorMessage('Sesión expirada. Por favor, inicia sesión nuevamente.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const query = new URLSearchParams(criteria as Record<string, string>).toString();
            const response = await fetch(`hhttps://servidor-7zli.onrender.com/notes/search?${query}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 404) {
                console.warn('No se encontraron resultados.');
                setErrorMessage('No se encontraron resultados para los criterios de búsqueda.');
                setSearchResults([]);
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error en el servidor: ${response.status} ${response.statusText} - ${errorText}`);
                setErrorMessage(`Error del servidor: ${response.status}`);
                return;
            }

            const data: Note[] = await response.json();
            console.log('Datos recibidos:', data);
            setSearchResults(data);
        } catch (err) {
            if (err instanceof Error) {
                console.error('Error al realizar la búsqueda:', err.message);
                setErrorMessage('Ocurrió un error al realizar la búsqueda. Por favor, intenta de nuevo.');
            } else {
                console.error('Error desconocido al realizar la búsqueda.');
                setErrorMessage('Error desconocido al realizar la búsqueda.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="advanced-search">
            <h1>Búsqueda Avanzada</h1>
            <SearchForm onSearch={handleSearch} />
            {isLoading && <p>Cargando resultados...</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}
            <table className="table table--notes">
                <thead className="table__thead">
                    <tr>
                        <th scope="col">Estado</th>
                        <th scope="col">Creada</th>
                        <th scope="col">Actualizada</th>
                        <th scope="col">Título</th>
                        <th scope="col">Dueño</th>
                        <th scope="col">Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.length > 0 ? (
                        searchResults.map((note) => (
                            <NoteComponent key={note._id} noteId={note._id} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6}>
                                {errorMessage || 'No se encontraron notas para los criterios especificados.'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdvancedSearch;

