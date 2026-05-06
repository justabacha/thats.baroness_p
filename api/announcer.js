import { MsEdgeTTS } from 'msedge-tts';

export default async function handler(req, res) {
  const { text } = req.query;
  
  try {
    const tts = new MsEdgeTTS();
    // Setting up the voice for the Baroness
    await tts.setMetadata('en-GB-SoniaNeural', 'audio-24khz-48kbitrate-mono-mp3');
    
    const buffer = await tts.pushAsync(text || "Testing the cloud announcer, mate!");

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cloud voice went ghost" });
  }
}