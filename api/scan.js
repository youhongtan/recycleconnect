export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { prompt, imageUrl } = await req.json();
  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), { status: 500 });
  }

  try {
    let base64, mime;

    if (imageUrl) {
      const imageRes = await fetch(imageUrl);
      const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
      base64 = imageBuffer.toString('base64');
      mime = imageRes.headers.get('content-type') || 'image/jpeg';
    }

    const parts = [{ text: prompt + '\n\nRespond in JSON only: item, material, recyclable, instructions, tip' }];
    if (base64) {
      parts.push({ inline_data: { mime_type: mime, data: base64 } });
    }

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] }),
    });

    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : {};

    return new Response(JSON.stringify(parsed), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
