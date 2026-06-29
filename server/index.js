import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PROXY_PORT || 8787;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

// Accepts the same { system, messages } shape the frontend already sends for
// Anthropic's API, and returns Anthropic's { content: [{ type, text }] }
// response shape — so the frontend doesn't need to know it's actually
// talking to OpenRouter under the hood.
app.post('/api/claude', async (req, res) => {
  if (!OPENROUTER_API_KEY) {
    res.status(500).json({
      error: 'Server is missing OPENROUTER_API_KEY. Add it to a .env file in the project root and restart the server.',
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
});

app.listen(PORT, () => {
  console.log(`Chat proxy listening on http://localhost:${PORT} (model: ${MODEL})`);
  if (!OPENROUTER_API_KEY) {
    console.warn('Warning: OPENROUTER_API_KEY is not set. Voice conversation calls will fail until it is.');
  }
});
