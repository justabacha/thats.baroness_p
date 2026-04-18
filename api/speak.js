export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Clever Check: If body is a string, parse it. If it's already an object, use it.
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const text = body.text;
    
    // Exact match to your Vercel screenshot names
    const key = process.env.ELEVEN_LABS_API_KEY;
    const voice = process.env.VOICE_ID;

    if (!key || !voice) {
        return res.status(500).json({ error: "Vercel is missing environment variables, mate!" });
    }

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
            method: 'POST',
            headers: { 
                'xi-api-key': key, 
                'Content-Type': 'application/json' 
            },
           body: JSON.stringify({ 
            text: text, 
            model_id: "eleven_flash_v2_5", // This is the new, fast, free-tier friendly model
            voice_settings: { 
                stability: 0.5, 
                similarity_boost: 0.5 
            }
        })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ElevenLabs Error:", errorText);
            return res.status(response.status).send(errorText);
        }

        const audioBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        return res.send(Buffer.from(audioBuffer));

    } catch (err) {
        console.error("Bridge Crash:", err);
        return res.status(500).json({ error: 'Bridge totally crashed, blud' });
    }
}