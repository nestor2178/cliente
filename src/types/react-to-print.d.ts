// src/types/react-to-print.d.ts
declare module 'react-to-print' {
    export function useReactToPrint(options: {
      content: () => React.ReactInstance | null;
      pageStyle?: string;
      documentTitle?: string;
      removeAfterPrint?: boolean;
      onAfterPrint?: () => void;
    }): () => void;
  }