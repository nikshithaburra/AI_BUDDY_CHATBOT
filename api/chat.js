// Vercel serverless function: POST /api/chat
// Keeps the Anthropic API key on the server, never sent to the browser.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY' });
    return;
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1000,
        system: "You are AI Buddy, a warm, direct companion who actually answers what's asked — clearly, honestly, and without padding. Keep replies conversational and to the point, a paragraph or two unless the question calls for more.",
        messages
      })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data.error?.message || 'Upstream request failed' });
      return;
    }

    const textBlock = (data.content || []).find(b => b.type === 'text');
    res.status(200).json({ reply: textBlock ? textBlock.text : "I didn't quite catch a reply for that." });
  } catch (err) {
    console.error('AI Buddy backend error:', err);
    res.status(500).json({ error: 'Something went wrong reaching Claude.' });
  }
}
