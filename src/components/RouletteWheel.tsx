import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Opciones de premios para la ruleta. Cada entrada contiene una etiqueta
 * legible para el usuario y puede mapearse a una lógica de negocio
 * más compleja en el servidor. Mantenemos 12 secciones para que la
 * ruleta sea visualmente equilibrada.
 */
export const PRIZES: string[] = [
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

interface RouletteWheelProps {
  /** Premio que debe mostrarse cuando la ruleta se detenga. */
  prize: string | null;
  /** Callback cuando la animación de giro finaliza. */
  onAnimationEnd: () => void;
}

/**
 * Componente de la ruleta de premios. Utiliza GSAP para animar el giro de
 * acuerdo con el premio calculado en el back‑end. Cuando cambia la
 * propiedad `prize`, se calcula el ángulo exacto para que el premio
 * quede alineado con el marcador superior y se ejecuta la animación.
 */
export default function RouletteWheel({ prize, onAnimationEnd }: RouletteWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);

  // Calcular el ángulo final basado en el índice del premio.
  const spinToPrize = (prizeValue: string) => {
    const index = PRIZES.findIndex((p) => p === prizeValue);
    const segmentAngle = 360 / PRIZES.length;
    // Aseguramos varias vueltas completas para mayor dramatismo (5 vueltas)
    const rotations = 5;
    // Convertimos el índice al ángulo deseado. El marcador está en la parte superior
    // (0 grados), por lo que necesitamos rotar la ruleta de modo que la
    // sección deseada quede arriba. GSAP gira en sentido horario por defecto.
    const finalAngle = rotations * 360 - index * segmentAngle + segmentAngle / 2;
    return finalAngle;
  };

  useEffect(() => {
    if (prize && wheelRef.current) {
      const angle = spinToPrize(prize);
      gsap.to(wheelRef.current, {
        rotation: angle,
        duration: 4,
        ease: 'power2.out',
        onComplete: onAnimationEnd,
      });
    }
  }, [prize]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Marcador en la parte superior */}
      <div className="absolute z-20 top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-akademico.accent"></div>
      {/* Rueda */}
      <div
        ref={wheelRef}
        className="ruleta w-64 h-64 rounded-full border-4 border-akademico.primary overflow-hidden relative"
        style={{}}
      >
        {/* Dividimos la ruleta en secciones iguales usando posicionamiento absoluto */}
        {PRIZES.map((p, i) => {
          const rotate = i * (360 / PRIZES.length);
          return (
            <div
              key={p + i}
              className="absolute top-1/2 left-1/2 w-full h-1/2 origin-bottom rotate-0"
              style={{
                transform: `rotate(${rotate}deg) translate(-50%, -100%)`,
                transformOrigin: '50% 100%',
              }}
            >
              <div
                className={
                  'flex items-center justify-center h-full w-full text-xs text-white' +
                  ' ' +
                  (i % 2 === 0 ? 'bg-akademico.primary' : 'bg-akademico.secondary')
                }
                style={{
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                }}
              >
                <span className="rotate-[-90deg]">{p}</span>
              </div>
            </div>
          );
        })}
        {/* Logo en el centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-white border-2 border-akademico.primary flex items-center justify-center text-akademico.primary font-bold text-center text-sm p-2">
            Akadémico
          </div>
        </div>
      </div>
    </div>
  );
}
