// src/utils/escapeHtml.tsx

/**
 * Escapa los caracteres especiales de HTML en una cadena de texto.
 * @param unsafe La cadena de texto potencialmente insegura.
 * @returns La cadena de texto con los caracteres HTML escapados.
 */
export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== "string") {
    console.warn("escapeHtml fue llamado con un valor no string:", unsafe);
    return ""; // O devuelve el valor tal cual, o un string vacío
  }
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Convierte las URLs en un texto en enlaces HTML clicables, escapando el resto del texto.
 * Diseñado para generar una cadena HTML segura para la impresión o contextos donde se usa `dangerouslySetInnerHTML`.
 * @param text El texto original que puede contener URLs.
 * @returns Una cadena HTML con URLs convertidas en enlaces y el resto del texto escapado.
 */
export function linkifyForPrintHTML(text: string): string {
  if (typeof text !== "string") {
    console.warn(
      "linkifyForPrintHTML fue llamado con un valor no string:",
      text
    );
    return ""; // O devuelve el valor tal cual, o un string vacío
  }

  // Expresión regular mejorada para detectar http(s)/ftp y www.
  // \b asegura que no se coincida dentro de otra palabra.
  // ig: global (todas las ocurrencias) e ignore case (ignora mayúsculas/minúsculas).
  const urlRegex =
    /(\b(?:https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]|\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  let resultHTML = "";
  let lastIndex = 0;
  let match;

  // Iteramos sobre todas las URLs encontradas en el texto
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[0]; // La URL completa encontrada
    const index = match.index; // La posición donde comienza la URL en el texto

    // 1. Tomamos la porción de texto ANTES de la URL encontrada, la escapamos y la añadimos al resultado.
    resultHTML += escapeHtml(text.substring(lastIndex, index));

    // 2. Construimos el enlace HTML.
    //    Aseguramos que las URLs que comienzan con 'www.' tengan 'http://' para el atributo href.
    const href = url.toLowerCase().startsWith("www.") ? `http://${url}` : url;

    //    Añadimos la etiqueta <a>.
    //    Escapamos el contenido del atributo href por seguridad adicional.
    //    Escapamos el texto visible del enlace (la URL) por si la URL misma tuviera caracteres interpretables como HTML.
    resultHTML += `<a href="${escapeHtml(
      href
    )}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>`;

    // Actualizamos lastIndex para la siguiente iteración, para que apunte al final de la URL actual.
    lastIndex = index + url.length;
  }

  // 3. Añadimos cualquier porción de texto restante DESPUÉS de la última URL encontrada (escapada).
  resultHTML += escapeHtml(text.substring(lastIndex));

  return resultHTML;
}

// --- Opcional: Componente React para Linkify (si lo necesitas para la UI principal) ---
// Si en el futuro quieres mostrar enlaces clicables directamente en tu UI de React
// (no solo para imprimir), este es el enfoque más seguro y recomendado que te mencioné.
// No lo necesitas para PrintNotesButton si solo generas HTML allí.

/*
import React from 'react';

interface LinkifiedTextProps {
  text: string;
}

export const LinkifiedText: React.FC<LinkifiedTextProps> = ({ text }) => {
  if (!text) return null;

  const parts = [];
  let lastIndex = 0;
  let match;
  const localUrlRegex = /(\b(?:https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]|\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  let keyCounter = 0;

  while ((match = localUrlRegex.exec(text)) !== null) {
    const url = match[0];
    const index = match.index;

    if (index > lastIndex) {
      parts.push(
        <span key={`text-${keyCounter++}`}>
          {escapeHtml(text.substring(lastIndex, index))}
        </span>
      );
    }

    const href = url.toLowerCase().startsWith('www.') ? `http://${url}` : url;
    parts.push(
      <a
        href={href} // No necesitas escapar el href aquí si confías en la URL, React lo maneja
        target="_blank"
        rel="noopener noreferrer"
        key={`link-${keyCounter++}`}
      >
        {escapeHtml(url)}
      </a>
    );
    
    lastIndex = index + url.length;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${keyCounter++}`}>
        {escapeHtml(text.substring(lastIndex))}
      </span>
    );
  }

  return <>{parts}</>;
};
*/
