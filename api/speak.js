export default async function handler(req, res) {
    const { text } = JSON.parse(req.body);
    const key = process.env.ELEVEN_LABS_API_KEY;
    const voice = process.env.VOICE_ID;

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

    if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
    }

    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
}