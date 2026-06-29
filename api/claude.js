const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

// Vercel serverless equivalent of server/index.js — accepts the same
// { system, messages } shape and returns Anthropic's { content: [...] }
// shape so the frontend doesn't need to know it's talking to OpenRouter.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!OPENROUTER_API_KEY) {
    res.status(500).json({
      error: 'Server is missing OPENROUTER_API_KEY. Add it in the Vercel project Environment Variables.',
    });
    return;
  }

  const { system, messages } = req.body || {};
  if (!Array.isArray(messages)) {
    res.status(400).json({ error: 'Request body must include a "messages" array.' });
    return;
  }

  const openRouterMessages = system ? [{ role: 'system', content: system }, ...messages] : messages;

  try {
    const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        messages: openRouterMessages,
      }),
    });

    const data = await orRes.json();

    if (!orRes.ok) {
      res.status(orRes.status).json(data);
      return;
    }

    const text = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (err) {
    console.error('OpenRouter proxy error:', err);
    res.status(502).json({ error: 'Failed to reach the OpenRouter API.' });
  }
}
