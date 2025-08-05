import React, { useState } from 'react';
import RegistrationForm, { RegistrationData } from './components/RegistrationForm';
import RouletteWheel from './components/RouletteWheel';
import PrizeModal from './components/PrizeModal';

import axios from 'axios';

/**
 * Funcón para seleccionar un premio de manera ponderada. Útil como
 * fallback cuando el back‑end no está disponible. Las probabilidades son
 * definidas de acuerdo con los requisitos del negocio: 1% para S/1000,
 * 5% para S/500, etc. El arreglo de pesos debe sumar 100.
 */
function weightedRandomPrize() {
  const prizes = [
    'S/1000',
    'S/500',
    'S/100',
    'S/50',
    'S/20',
    'S/10',
    'Gracias por participar',
    'S/5',
    'S/200',
    'S/150',
    'S/75',
    'S/25',
  ];
  // Probabilidades correspondientes en porcentaje (deben sumar 100)
  const weights = [1, 5, 10, 10, 10, 10, 30, 5, 5, 5, 5, 4];
  const total = weights.reduce((a, b) => a + b, 0);
  const rnd = Math.random() * total;
  let cumulative = 0;
  for (let i = 0; i < prizes.length; i++) {
    cumulative += weights[i];
    if (rnd <= cumulative) {
      return prizes[i];
    }
  }
  return prizes[prizes.length - 1];
}

export default function App() {
  const [prize, setPrize] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Envía los datos del formulario al endpoint /api/spin.
  const handleFormSubmit = async (data: RegistrationData) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/spin', data);
      const { premio } = response.data;
      setPrize(premio);
    } catch (error) {
      console.warn('No se pudo contactar con el servidor, utilizando lógica local.', error);
      // Fallback local si el servidor no está disponible.
      setPrize(weightedRandomPrize());
    } finally {
      setLoading(false);
    }
  };

  const handleAnimationEnd = () => {
    // Mostrar el modal cuando la animación termine
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPrize(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-akademico.secondary to-akademico.primary text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ruletea con Akadémico</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <RegistrationForm onSubmit={handleFormSubmit} loading={loading} />
      </div>
      <div className="mt-10">
        <RouletteWheel prize={prize} onAnimationEnd={handleAnimationEnd} />
      </div>
      {showModal && prize && (
        <PrizeModal prize={prize} onClose={closeModal} />
      )}
    </div>
  );
}
