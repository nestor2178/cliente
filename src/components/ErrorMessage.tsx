import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ErrorMessageProps {
  error: FetchBaseQueryError | SerializedError | undefined;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  const getErrorMessage = (): string => {
    if (!error) return 'Error desconocido';
    
    if ('status' in error) {
      return `Error: ${error.status}`;
    }
    
    if ('message' in error) {
      return error.message || 'Error desconocido';
    }
    
    return 'Error desconocido';
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
      {errorMessage}
    </div>
  );
};

export default ErrorMessage;