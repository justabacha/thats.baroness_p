async function announceVibe() {
    const now = new Date();
    const dayName = now.toLocaleDateString('en-GB', { weekday: 'long' });
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 

    let minutesStr = (minutes === 0) ? "o'clock" : (minutes < 10) ? `oh ${minutes}` : minutes;
    const period = ampm === 'AM' ? 'morning' : 'evening';
    const timeForVoice = `${hours} ${minutesStr} in the ${period}`;

    const welcome = userProfile ? `Hi ${userProfile.displayName}` : (document.getElementById('welcome-text')?.innerText || "Hi there");
    const greeting = document.getElementById('dynamic-greeting')?.innerText || "Welcome back";
    const rawStatus = document.getElementById('local-time')?.innerText || "";
    const cleanStatus = rawStatus.split('||')[1]?.trim() || "stay in your zone";

    const introVariants = ["Quick update,", "Here’s where we are,", "Right now,"];
    const intro = introVariants[Math.floor(Math.random() * introVariants.length)];

    const fullMessage = `${welcome}. ${greeting}... ${intro} it’s ${dayName}, ${dateStr},. The time is ${timeForVoice}.. Just so you know, ${cleanStatus}.`;
    const cleanText = fullMessage.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    try {
        const response = await fetch('/api/speak', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: cleanText })
        });
        
        if (!response.ok) throw new Error(`API Bridge failed: ${response.status}`);
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);
        
        // Clean up memory after playing
        audioElement.onended = () => URL.revokeObjectURL(audioUrl);

        await audioElement.play();
        
    } catch (error) {
        // No more robot fallback, just a quiet log if things go ghost
        console.error("Edge TTS could not play:", error);
    }
}