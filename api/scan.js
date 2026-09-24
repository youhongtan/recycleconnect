// RecycleConnect V1 — POST /api/scan (fixed Sep 2026)
//
// Lineup (verified live): Cloudflare Scout first when
// CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID are configured,
// then Gemini gemini-3.5-flash, gemini-3.6-flash, then keyless Pollinations.
// Only the first candidate that parses into >=2 informative keys is returned;
// placeholder answers ("Unknown", "No information available", …) are skipped.
// Worst case: scout 8s + gemini 12s + gemini 12s + pollinations 12s = 44s,
// inside Vercel Hobby's ~60s serverless limit (single attempt each, no retries).

function send(res, code, data) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (c) => body += c);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function fetchTimeout(url, opts, ms) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  const p = fetch(url, { ...opts, signal: c.signal });
  return p.finally(() => clearTimeout(t));
}

const GEMINI_MODELS = ['gemini-3.5-flash', 'gemini-3.6-flash'];
const TIMEOUTS = { scout: 8000, gemini: 12000, pollinations: 12000 };

const SCHEMA_KEYS = ['item', 'material', 'recyclable', 'instructions', 'tip'];

// Phrases models emit when they can't (or won't) identify the item.
const EVASIVE_PREFIXES = [
  'unknown', 'n/a', 'n a', 'none', 'no information', 'unable to provide',
  'unable to identify', 'cannot identify', 'cant identify', 'could not identify',
  'try describing', 'without identifying', 'not identifiable', 'no data',
  'unsure', 'not sure', 'no idea', 'unrecognizable', 'unrecognized',
];

function isEvasive(value) {
  const v = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!v) return true;
  return EVASIVE_PREFIXES.some((p) => v.startsWith(p));
}

// Accept only answers that parse into >=2 informative fields
// and that at least name the item.
function tryParseResult(text) {
  const cleaned = String(text || '')
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .replace(/<think>[\s\S]*?(?:<\/think>|$)/g, '')
    .trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace <= firstBrace) return null;
  let parsed;
  try {
    parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  if (isEvasive(parsed.item)) return null;
  const filled = SCHEMA_KEYS.filter(
    (k) => typeof parsed[k] === 'string' && !isEvasive(parsed[k])
  );
  return filled.length >= 2 ? parsed : null;
}

// Returns parsed object, or null (with a server-side skip log).
function acceptCandidate(who, text) {
  const parsed = tryParseResult(text);
  if (!parsed) {
    console.error(`Scan candidate from ${who} rejected (not JSON / empty / placeholder):`, String(text || '').slice(0, 160));
  }
  return parsed;
}

function dataUrlToInline(imageData) {
  const m = (imageData || '').match(/^data:(image\/[a-z0-9+.-]+);base64,(.+)$/);
  if (!m) return null;
  return { mime_type: m[1], data: m[2] };
}

async function geminiVision(apiKey, model, textPrompt, imageData) {
  const inline = dataUrlToInline(imageData);
  if (!inline) throw new Error('Invalid image data');
  const r = await fetchTimeout(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: textPrompt },
          { inline_data: inline },
        ],
      }],
      generationConfig: { maxOutputTokens: 500, temperature: 0.2 },
    }),
  }, TIMEOUTS.gemini);
  const data = await r.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// Cloudflare Llama 4 Scout vision — only when configured (verified ~1s live).
async function scoutVision(accountId, token, textPrompt, imageData) {
  const r = await fetchTimeout(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-4-scout-17b-16e-instruct`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: textPrompt },
          { type: 'image_url', image_url: { url: imageData } },
        ],
      }],
    }),
  }, TIMEOUTS.scout);
  const data = await r.json();
  return data?.result?.choices?.[0]?.message?.content || data?.result?.response || '';
}

// Pollinations.ai vision fallback — free, no key, OpenAI image_url shape.
async function pollinationsVision(textPrompt, imageData) {
  const r = await fetchTimeout('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: textPrompt },
          { type: 'image_url', image_url: { url: imageData } },
        ],
      }],
    }),
  }, TIMEOUTS.pollinations);
  const data = await r.json();
  return data?.choices?.[0]?.message?.content || '';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  const bodyStr = await readBody(req);
  let body;
  try { body = JSON.parse(bodyStr); } catch { return send(res, 400, { error: 'Invalid JSON body' }); }

  const { prompt, imageData, lang } = body;
  if (!prompt) return send(res, 400, { error: 'Prompt is required' });

  const geminiKey = process.env.VITE_GEMINI_API_KEY;
  const cfToken = process.env.CLOUDFLARE_API_TOKEN;
  const cfAccount = process.env.CLOUDFLARE_ACCOUNT_ID;
  const hasCf = !!(cfToken && cfAccount);
  if (!geminiKey && !hasCf) return send(res, 500, { error: 'AI is not configured right now.' });

  const langRule =
    lang === 'ms' ? ' Write all JSON values in Bahasa Melayu (keys stay in English).'
    : lang === 'zh' ? ' JSON values in Simplified Chinese (keys stay in English).'
    : '';

  const schema = { item: '', material: '', recyclable: '', instructions: '', tip: '' };
  const textPrompt = prompt + '\n\nYou MUST respond with ONLY valid JSON. No markdown, no explanation. Use exactly these keys: item, material, recyclable, instructions, tip.' + langRule + ' Example: {"item": "plastic bottle", "material": "Plastic", "recyclable": "Yes", "instructions": "Rinse it.", "tip": "Recycle me."}';

  try {
    if (hasCf) {
      try {
        const parsed = acceptCandidate('scout', await scoutVision(cfAccount, cfToken, textPrompt, imageData));
        if (parsed) return send(res, 200, { ...schema, ...parsed });
      } catch (e) {
        console.error('Scan scout failed:', e?.message || e);
      }
    }
    if (geminiKey && imageData) {
      for (const model of GEMINI_MODELS) {
        try {
          const parsed = acceptCandidate(`gemini:${model}`, await geminiVision(geminiKey, model, textPrompt, imageData));
          if (parsed) return send(res, 200, { ...schema, ...parsed });
        } catch (e) {
          console.error(`Scan gemini:${model} failed:`, e?.message || e);
        }
      }
    }
    try {
      const parsed = acceptCandidate('pollinations', await pollinationsVision(textPrompt, imageData));
      if (parsed) return send(res, 200, { ...schema, ...parsed });
    } catch (e) {
      console.error('Scan pollinations failed:', e?.message || e);
    }

    console.error('Scan: all providers skipped/failed.');
    return send(res, 500, { error: 'AI is busy right now. Please try again in a moment.' });
  } catch (error) {
    console.error('Scan API error:', error.message);
    return send(res, 500, { error: 'AI is busy right now. Please try again in a moment.' });
  }
};
