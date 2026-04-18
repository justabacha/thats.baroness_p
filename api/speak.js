export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { text } = JSON.parse(req.body);
    const key = process.env.ELEVEN_LABS_API_KEY;
    const voice = process.env.VOICE_ID;

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
            method: 'POST',
            headers: { 
                'xi-api-key': key, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                text, 
                model_id: "eleven_monolingual_v1",
                voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            })
        });

        const audioBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(audioBuffer));
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate voice' });
    }
}