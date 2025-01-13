import React, { useState } from 'react';

interface SearchCriteria {
    title?: string;
    text?: string;
    startDate?: string;
    endDate?: string;
    completed?: string;
    username?: string;
}

interface SearchFormProps {
    onSearch: (criteria: SearchCriteria) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [completed, setCompleted] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Verificar que al menos un campo esté lleno
        if (!title && !text && !startDate && !endDate && !completed && !username) {
            setErrorMessage('Por favor, ingresa al menos un criterio de búsqueda.');
            return;
        }

        setErrorMessage(''); // Limpiar mensajes de error previos
        const searchCriteria: SearchCriteria = { title, text, startDate, endDate, completed, username };
        onSearch(searchCriteria);
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="form-group">
                <label htmlFor="title">Título:</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label htmlFor="text">Texto:</label>
                <input
                    id="text"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label htmlFor="startDate">Fecha de inicio:</label>
                <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label htmlFor="endDate">Fecha de fin:</label>
                <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label htmlFor="completed">Completado:</label>
                <select
                    id="completed"
                    value={completed}
                    onChange={(e) => setCompleted(e.target.value)}
                    className="form-input"
                >
                    <option value="">Cualquiera</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="username">Nombre de usuario:</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                />
            </div>
            <button type="submit" className="submit-button">Buscar</button>
        </form>
    );
};

export default SearchForm;
