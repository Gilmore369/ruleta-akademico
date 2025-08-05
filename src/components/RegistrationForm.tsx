import React, { useState, useEffect } from 'react';

export interface RegistrationData {
  name: string;
  email: string;
  whatsapp: string;
}

interface RegistrationFormProps {
  /** Funcón que se ejecuta al enviar el formulario válido. */
  onSubmit: (data: RegistrationData) => void;
  /** Indica si se está procesando la solicitud. Sirve para deshabilitar el botón de envío. */
  loading?: boolean;
}

/**
 * Componente de formulario de registro. Recopila el nombre completo, el correo
 * electrónico y el número de WhatsApp del participante. Valida los campos
 * antes de enviar y notifica al padre mediante el callback `onSubmit`.
 */
export default function RegistrationForm({ onSubmit, loading = false }: RegistrationFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Valida el formulario en cada cambio
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{9,15}$/;
    const valid =
      name.trim().length > 3 &&
      emailRegex.test(email.trim()) &&
      phoneRegex.test(whatsapp.trim());
    setIsValid(valid);
  }, [name, email, whatsapp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ name: name.trim(), email: email.trim(), whatsapp: whatsapp.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre completo
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-akademico.primary focus:ring-akademico.primary"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-akademico.primary focus:ring-akademico.primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
          WhatsApp
        </label>
        <input
          type="tel"
          id="whatsapp"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-akademico.primary focus:ring-akademico.primary"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="987654321"
          required
        />
      </div>
      <button
        type="submit"
        disabled={!isValid || loading}
        className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors ${
          !isValid || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-akademico.primary hover:bg-akademico.dark'
        }`}
      >
        {loading ? 'Procesando...' : 'Girar'}
      </button>
    </form>
  );
}
