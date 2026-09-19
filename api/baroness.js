// api/baroness.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body safely for JSON or raw string
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const {
    text,
    provider = 'gemini',             // Options: 'gemini', 'deepgram', 'murf'
    voice = 'Kore',                  // Gemini voices: Kore, Puck, Fenrir, Aoede, Leda
    directorNote = 'Speak in a clear, natural, and expressive tone.'
  } = body;

  if (!text) {
    return res.status(400).json({ error: 'Missing text field' });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const murfKey = process.env.MURF_API_KEY;

  // ---------- 1. PRIMARY: Gemini TTS API ----------
  if (provider === 'gemini' && geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key=${geminiKey}`;

      const geminiResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${directorNote}\n\n${text}` }]
          }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice }
              }
            }
          }
        })
      });

      if (geminiResponse.ok) {
        const data = await geminiResponse.json();
        const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (base64Audio) {
          const audioBuffer = Buffer.from(base64Audio, 'base64');
          res.setHeader('Content-Type', 'audio/wav');
          return res.send(audioBuffer);
        }
      } else {
        const errText = await geminiResponse.text();
        console.error(`Gemini TTS Error (${geminiResponse.status}):`, errText);
      }
    } catch (err) {
      console.error('Gemini TTS Exception:', err.message);
    }
  }

  // ---------- 2. SECONDARY: OpenRouter Deepgram Flux TTS (FREE) ----------
  if (openRouterKey) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://thats-baroness-p.vercel.app',
          'X-Title': 'AVIS System'
        },
        body: JSON.stringify({
          model: 'deepgram/flux-tts:free',
          input: text,
          voice: 'flux-alexis-en',
          response_format: 'mp3'
        })
      });

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        return res.send(Buffer.from(audioBuffer));
      } else {
        const errText = await response.text();
        console.error(`OpenRouter TTS error (${response.status}):`, errText);
      }
    } catch (err) {
      console.error('OpenRouter TTS exception:', err.message);
    }
  }

  // ---------- 3. TERTIARY FALLBACK: Murf AI ----------
  if (murfKey) {
    try {
      const murfResponse = await fetch('https://api.murf.ai/v1/speech/generate', {
        method: 'POST',
        headers: {
          'api-key': murfKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voiceId: "en-US-marcus",
          modelVersion: "GEN2",
          style: 'conversational',
          rate: 0,
          pitch: 0,
          format: 'MP3',
          channelType: 'MONO',
          encodeAsBase64: false,
        }),
      });

      if (murfResponse.ok) {
        const murfData = await murfResponse.json();
        const audioResponse = await fetch(murfData.audioFile);
        const audioBuffer = await audioResponse.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        return res.send(Buffer.from(audioBuffer));
      } else {
        const errorText = await murfResponse.text();
        console.error(`Murf AI error (${murfResponse.status}):`, errorText);
      }
    } catch (err) {
      console.error('Murf AI exception:', err.message);
    }
  }

  // ---------- 4. FINAL FALLBACK: Edge TTS ----------
  try {
    const { synthesize: edgeTTS } = await import('@echristian/edge-tts');
    const edgeResult = await edgeTTS({
      text: text,
      voice: 'en-US-JennyNeural',
      outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
    });

    let audioBuffer = Buffer.isBuffer(edgeResult.audio)
      ? edgeResult.audio
      : Buffer.from(edgeResult.audio);

    res.setHeader('Content-Type', 'audio/mpeg');
    return res.send(audioBuffer);
  } catch (err) {
    console.error('Edge TTS fallback failed:', err.message);
    return res.status(500).json({ error: 'All TTS engines failed, mate' });
  }
}
