import React from 'react';

interface PrizeModalProps {
  prize: string;
  onClose: () => void;
}

/**
 * Modal de premio. Se muestra cuando la ruleta termina de girar y el
 * participante ha obtenido un premio. Permite cerrar el modal para
 * intentar realizar otra acción o simplemente para limpiar la interfaz.
 */
export default function PrizeModal({ prize, onClose }: PrizeModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-2xl font-semibold mb-4 text-akademico.primary">¡Felicidades! </h2>
        <p className="text-lg mb-6">Has ganado:</p>
        <p className="text-3xl font-bold text-akademico.accent mb-6">{prize}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-akademico.primary text-white rounded-md hover:bg-akademico.dark"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
