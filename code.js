// api/chat.js
import OpenAI from 'openai'; // Necesitarás instalar la librería 'openai' en tu proyecto

// Crea una instancia de OpenAI usando la clave de entorno de Vercel
// ¡Esta clave se configura en el dashboard de Vercel, no la pones aquí directamente!
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Vercel inyecta tu clave aquí de forma SEGURA
});

export default async function handler(req, res) {
  // Solo acepta peticiones POST desde tu frontend
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Si la clave API no está configurada en Vercel, avisa
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: 'Error: La clave API de OpenAI no está configurada en las variables de entorno de Vercel.' });
  }

  try {
    // Obtiene los mensajes (historial) y el modelo del cuerpo de la petición de tu frontend
    const { messages, model = 'gpt-4o' } = req.body;

    if (!messages) {
      return res.status(400).json({ message: 'Error: Faltan mensajes en el cuerpo de la solicitud.' });
    }

    // Realiza la llamada a la API de OpenAI de forma segura desde el servidor de Vercel
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7, // Ajusta la creatividad de la IA (0.0 a 1.0)
      max_tokens: 1000, // Ajusta la longitud máxima de la respuesta de la IA
    });

    // Envía la respuesta completa de OpenAI de vuelta a tu frontend
    res.status(200).json(completion);

  } catch (error) {
    console.error('Error en la función sin servidor de OpenAI:', error);
    res.status(500).json({ message: 'Error procesando la solicitud de la IA en el servidor.', details: error.message });
  }
}