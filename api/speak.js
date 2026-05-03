// api/speak.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body safely
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const text = body.text;

  if (!text) {
    return res.status(400).json({ error: 'Missing text field' });
  }

  // ---------- PRIMARY: Murf AI ----------
  const murfKey = process.env.MURF_API_KEY;
  const murfVoice = process.env.MURF_VOICE_ID;      // e.g., "Peter"
  const murfModel = process.env.MURF_MODEL || 'FALCON'; // Corrected: Use 'FALCON' for the model

  if (murfKey && murfVoice) {
    try {
      // The correct endpoint for non-streaming generation
      const murfResponse = await fetch('https://api.murf.ai/v1/speech/generate', {
        method: 'POST',
        headers: {
          'api-key': murfKey,           // Correct header for authentication
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voiceId: murfVoice,           // Correct field name is "voiceId"
          model: murfModel,              // Correctly uses the model variable
          style: 'conversational',
          rate: 0,
          pitch: 0,
          format: 'MP3',
          channelType: 'MONO',
          encodeAsBase64: false          // We want a URL, not base64, for easier handling
        }),
      });

      if (murfResponse.ok) {
        const murfData = await murfResponse.json();
        // The response contains an 'audioFile' URL to the generated speech
        const audioUrl = murfData.audioFile;
        
        // Fetch the audio from the URL and stream it back to the client
        const audioResponse = await fetch(audioUrl);
        const audioBuffer = await audioResponse.arrayBuffer();
        
        res.setHeader('Content-Type', 'audio/mpeg');
        return res.send(Buffer.from(audioBuffer));
      } else {
        console.error(`Murf AI error: ${murfResponse.status}`);
        const errorText = await murfResponse.text();
        console.error('Murf error details:', errorText);
      }
    } catch (err) {
      console.error('Murf AI exception:', err.message);
    }
  } else {
    console.warn('Murf credentials missing');
  }

  // ---------- FALLBACK: Edge TTS (dynamic import to avoid ESM error) ----------
  try {
    const { synthesize: edgeTTS } = await import('@echristian/edge-tts');
    const edgeResult = await edgeTTS({
      text: text,
      voice: 'en-US-JennyNeural',
      outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
    });

    let audioBuffer;
    if (Buffer.isBuffer(edgeResult.audio)) {
      audioBuffer = edgeResult.audio;
    } else if (edgeResult.audio instanceof Uint8Array) {
      audioBuffer = Buffer.from(edgeResult.audio);
    } else {
      throw new Error('Unexpected audio format');
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    return res.send(audioBuffer);
  } catch (err) {
    console.error('Edge TTS failed:', err.message);
    return res.status(500).json({ error: 'All TTS engines failed, mate' });
  }
}