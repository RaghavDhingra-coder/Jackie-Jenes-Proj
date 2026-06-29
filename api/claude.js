// .trim() guards against trailing newlines/whitespace that sneak in when
// pasting values into the Vercel dashboard — Authorization headers and
// model slugs with stray whitespace get rejected by OpenRouter with a 400.
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim();
const MODEL = process.env.OPENROUTER_MODEL?.trim() || 'openai/gpt-4o-mini';

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
  console.log('Request body messages count:', Array.isArray(messages) ? messages.length : 'not an array');

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Request body must include a non-empty "messages" array.' });
    return;
  }

  const openRouterMessages = system ? [{ role: 'system', content: system }, ...messages] : messages;

  try {
    console.log('Calling OpenRouter with model:', MODEL, 'message count:', openRouterMessages.length);

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

    const responseText = await orRes.text();
    console.log('OpenRouter status:', orRes.status);
    if (!orRes.ok) {
      console.log('OpenRouter error response:', responseText);
      res.status(orRes.status).json({ error: responseText });
      return;
    }

    const data = JSON.parse(responseText);
    const text = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (err) {
    console.error('OpenRouter proxy error:', err);
    res.status(502).json({ error: 'Failed to reach the OpenRouter API.' });
  }
}
