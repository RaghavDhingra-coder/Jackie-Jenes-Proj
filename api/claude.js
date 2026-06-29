const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();

// Vercel serverless equivalent of server/index.js — accepts the same
// { system, messages } shape and returns Anthropic's { content: [...] }
// shape so the frontend doesn't need to know it's talking to Gemini.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!GEMINI_API_KEY) {
    res.status(500).json({
      error: 'Server is missing GEMINI_API_KEY. Add it in the Vercel project Environment Variables.',
    });
    return;
  }

  const { system, messages } = req.body || {};
  console.log('Request body messages count:', Array.isArray(messages) ? messages.length : 'not an array');

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Request body must include a non-empty "messages" array.' });
    return;
  }

  try {
    console.log('Calling Gemini with message count:', messages.length);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: system }],
          },
          contents: messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
        }),
      }
    );

    const responseText = await response.text();
    console.log('Gemini status:', response.status);
    if (!response.ok) {
      console.log('Gemini error response:', responseText);
      res.status(response.status).json({ error: responseText });
      return;
    }

    const data = JSON.parse(responseText);
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (err) {
    console.error('Gemini proxy error:', err);
    res.status(502).json({ error: 'Failed to reach the Gemini API.' });
  }
}
