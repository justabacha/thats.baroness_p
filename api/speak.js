// api/speak.js
import { synthesize as edgeTTS } from '@echristian/edge-tts';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body (works whether it's string or object)
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const text = body.text;

  if (!text) {
    return res.status(400).json({ error: 'Missing text field' });
  }

  // ---------- PRIMARY: Murf AI (high quality, limited free credits) ----------
  const murfKey = process.env.MURF_API_KEY;
  const murfVoice = process.env.MURF_VOICE_ID || 'en-US-natalie'; // default, change to your chosen voice ID
  const murfModel = process.env.MURF_MODEL || 'FALCON'; 
  if (murfKey) {
    try {
      const murfResponse = await fetch('https://api.murf.ai/v1/speak', {
        method: 'POST',
        headers: {
          'api-key': murfKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice: murfVoice,
          model: murfModel,
          style: 'conversational',
          rate: 0,
          pitch: 0,
          format: 'MP3',
          channelType: 'MONO',
        }),
      });

      if (murfResponse.ok) {
        const audioBuffer = await murfResponse.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        return res.send(Buffer.from(audioBuffer));
      } else {
        console.error(`Murf AI failed with status ${murfResponse.status}:`, await murfResponse.text());
        // fall through to Edge TTS
      }
    } catch (err) {
      console.error('Murf AI network error:', err.message);
      // fall through to Edge TTS
    }
  } else {
    console.warn('MURF_API_KEY missing, skipping Murf and using Edge TTS fallback directly');
  }

  // ---------- FALLBACK: Edge TTS (free, unlimited, no key needed) ----------
  try {
    const edgeResult = await edgeTTS({
      text: text,
      voice: 'en-US-JennyNeural',      // high-quality Microsoft neural voice
      outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
    });

    // edgeResult.audio is either a Buffer or Uint8Array
    let audioBuffer;
    if (Buffer.isBuffer(edgeResult.audio)) {
      audioBuffer = edgeResult.audio;
    } else if (edgeResult.audio instanceof Uint8Array) {
      audioBuffer = Buffer.from(edgeResult.audio);
    } else {
      throw new Error(`Unexpected audio type: ${typeof edgeResult.audio}`);
    }

    console.log(`Edge TTS succeeded: ${audioBuffer.length} bytes`);
    res.setHeader('Content-Type', 'audio/mpeg');
    return res.send(audioBuffer);
  } catch (edgeErr) {
    console.error('Edge TTS also failed:', edgeErr.message);
    // Ultimate fallback: return 500, browser will use native SpeechSynthesis
    return res.status(500).json({ error: 'All TTS engines failed, mate' });
  }
}