import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

/**
 * Tabla de premios y sus probabilidades. La suma de los pesos debe ser 100.
 * El cálculo de premios ocurre en el servidor para evitar manipulación del
 * cliente. Ajusta los pesos según las reglas de negocio.
 */
const prizeTable: { prize: string; weight: number }[] = [
  { prize: 'S/1000', weight: 1 },
  { prize: 'S/500', weight: 5 },
  { prize: 'S/100', weight: 10 },
  { prize: 'S/50', weight: 10 },
  { prize: 'S/20', weight: 10 },
  { prize: 'S/10', weight: 10 },
  { prize: 'Gracias por participar', weight: 30 },
  { prize: 'S/5', weight: 5 },
  { prize: 'S/200', weight: 5 },
  { prize: 'S/150', weight: 5 },
  { prize: 'S/75', weight: 5 },
  { prize: 'S/25', weight: 4 },
];

/**
 * Selecciona un premio de acuerdo con la tabla de pesos. Utiliza un número
 * aleatorio y suma los pesos hasta encontrar el intervalo que corresponde.
 */
function selectPrize(): string {
  const total = prizeTable.reduce((sum, item) => sum + item.weight, 0);
  const rnd = Math.random() * total;
  let cum = 0;
  for (const item of prizeTable) {
    cum += item.weight;
    if (rnd <= cum) return item.prize;
  }
  return prizeTable[prizeTable.length - 1].prize;
}

/**
 * Handler principal de la función serverless. Controla el límite de un giro por
 * IP, calcula el premio, registra los datos en Google Sheets y envía una
 * notificación por correo electrónico. Para funcionar correctamente debes
 * configurar las variables de entorno:
 *   - GOOGLE_FORM_ACTION_URL: URL de envío de respuestas de tu Google Form.
 *   - RESEND_API_KEY: clave de API para enviar correos con Resend.
 *   - ADMIN_EMAIL: dirección de correo que recibirá las notificaciones.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // Extraer la IP del solicitante desde los encabezados Vercel u otros proxies.
  const ipHeader = (req.headers['x-vercel-forwarded-for'] || req.headers['x-real-ip'] || '') as string;
  const ip = Array.isArray(ipHeader) ? ipHeader[0] : ipHeader.split(',')[0] || req.socket.remoteAddress || '';

  // Verificación de IP repetida: deberías implementar la comprobación utilizando
  // un almacén persistente como Vercel KV, Redis o una base de datos. Aquí
  // simplemente se deja un comentario para que implementes tu lógica.
  // const hasPlayed = await kv.get(ip);
  // if (hasPlayed) {
  //   return res.status(429).json({ message: 'Ya has participado. Solo se permite un giro por IP.' });
  // }

  const body: any = req.body;
  const { name, email, whatsapp } = body;

  // Validación básica de campos del servidor. Asegura que el cliente no envíe
  // datos malformados.
  if (!name || !email || !whatsapp) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  const prize = selectPrize();

  // Marca la IP como utilizada. Descomenta si utilizas un almacén real.
  // await kv.put(ip, true);

  // Registrar en Google Sheets mediante Google Forms. Construimos un
  // formulario de URL encoded con los entry IDs obtenidos del formulario.
  try {
    const formUrl = process.env.GOOGLE_FORM_ACTION_URL;
    if (formUrl) {
      const params = new URLSearchParams();
      // Sustituye los entry.xxxx por los IDs reales de tu formulario
      params.append('entry.1111111111', name);
      params.append('entry.2222222222', email);
      params.append('entry.3333333333', whatsapp);
      params.append('entry.4444444444', prize);
      params.append('entry.5555555555', ip);
      params.append('entry.6666666666', new Date().toISOString());
      await axios.post(formUrl, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    }
  } catch (err) {
    console.error('Error al enviar datos al Formulario de Google:', err);
  }

  // Enviar notificación por correo electrónico mediante Resend. Configura
  // correctamente tu API key y el destinatario en las variables de entorno.
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (resendApiKey && adminEmail) {
      await axios.post(
        'https://api.resend.com/emails',
        {
          from: 'no-reply@akadémico.com',
          to: adminEmail,
          subject: 'Nuevo participante en la ruleta Akadémico',
          html: `<p><strong>Nombre:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>WhatsApp:</strong> ${whatsapp}</p>
                 <p><strong>Premio:</strong> ${prize}</p>
                 <p><strong>IP:</strong> ${ip}</p>
                 <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>`,
        },
        {
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
    }
  } catch (err) {
    console.error('Error al enviar correo electrónico:', err);
  }

  return res.status(200).json({ premio: prize });
}
