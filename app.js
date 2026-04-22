/***************************************************************************/
var _$_3619=["\x70\x68\x65\x73\x74\x6F\x4E\x65\x32\x31","","\x70\x61\x73\x73\x63\x6F\x64\x65\x2D\x69\x6E\x70\x75\x74","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x74\x6F\x67\x67\x6C\x65\x2D\x70\x61\x73\x73","\x74\x79\x70\x65","\x70\x61\x73\x73\x77\x6F\x72\x64","\x74\x65\x78\x74","\x69\x6E\x6E\x65\x72\x54\x65\x78\x74","\uD83D\uDD12","\uD83D\uDC41\uFE0F","\x74\x6F\x4C\x6F\x77\x65\x72\x43\x61\x73\x65","\x74\x72\x69\x6D","\x76\x61\x6C\x75\x65","\x75\x73\x65\x72\x2D\x6E\x61\x6D\x65","\x6C\x6F\x63\x6B\x2D\x6D\x73\x67","\x70\x68\x65\x73\x74\x79","\x70\x68\x65\x73\x74\x6F\x6E\x65","\x62\x61\x72\x6F\x6E\x65\x73\x73","\x62","\x50\x68\x65\x73\x74\x79","\x42\x61\x72\x6F\x6E\x65\x73\x73","\x76\x61\x75\x6C\x74\x5F\x75\x73\x65\x72","\x73\x65\x74\x49\x74\x65\x6D","\x76\x61\x75\x6C\x74\x5F\x6C\x6F\x67\x69\x6E\x5F\x74\x69\x6D\x65","\x6E\x6F\x77","\x49\x64\x65\x6E\x74\x69\x74\x79\x20\x6F\x72\x20\x63\x6F\x64\x65\x20\x6D\x69\x73\x6D\x61\x74\x63\x68\x2C\x20\x62\x65\x73\x74\x69\x65\x2E\x20\uD83D\uDEAB","\x6C\x6F\x63\x6B\x73\x63\x72\x65\x65\x6E","\x6F\x70\x61\x63\x69\x74\x79","\x73\x74\x79\x6C\x65","\x30","\x64\x69\x73\x70\x6C\x61\x79","\x6E\x6F\x6E\x65","\x6F\x6E\x6C\x6F\x61\x64","\x67\x65\x74\x49\x74\x65\x6D","\x72\x65\x6D\x6F\x76\x65\x49\x74\x65\x6D"];
var SECRET_CODE=_$_3619[0];//1
var SESSION_TIMEOUT=15* 60* 1000;//2
var currentUser=_$_3619[1];//3
function togglePeek()
{
	var _0x15AE9=document[_$_3619[3]](_$_3619[2]);//7
	var _0x15B2F=document[_$_3619[3]](_$_3619[4]);//8
	if(_0x15AE9[_$_3619[5]]=== _$_3619[6])
	{
		_0x15AE9[_$_3619[5]]= _$_3619[7];_0x15B2F[_$_3619[8]]= _$_3619[9]
	}
	else 
	{
		_0x15AE9[_$_3619[5]]= _$_3619[6];_0x15B2F[_$_3619[8]]= _$_3619[10]
	}
	
}
function checkPasscode()
{
	var _0x15AA3=document[_$_3619[3]](_$_3619[14])[_$_3619[13]][_$_3619[12]]()[_$_3619[11]]();//20
	var _0x15AE9=document[_$_3619[3]](_$_3619[2])[_$_3619[13]];//21
	var _0x15A5D=document[_$_3619[3]](_$_3619[15]);//22
	var _0x15A17=_0x15AA3=== _$_3619[16]|| _0x15AA3=== _$_3619[17];//24
	var _0x159D1=_0x15AA3=== _$_3619[18]|| _0x15AA3=== _$_3619[19];//25
	if((_0x15A17|| _0x159D1)&& _0x15AE9=== SECRET_CODE)
	{
		currentUser= _0x15A17?_$_3619[20]:_$_3619[21];localStorage[_$_3619[23]](_$_3619[22],currentUser);localStorage[_$_3619[23]](_$_3619[24],Date[_$_3619[25]]());unlockVault()
	}
	else 
	{
		_0x15A5D[_$_3619[8]]= _$_3619[26];document[_$_3619[3]](_$_3619[2])[_$_3619[13]]= _$_3619[1]
	}
	
}
function unlockVault()
{
	var _0x158FF=document[_$_3619[3]](_$_3619[27]);//42
	_0x158FF[_$_3619[29]][_$_3619[28]]= _$_3619[30];setTimeout(function()
	{
		_0x158FF[_$_3619[29]][_$_3619[31]]= _$_3619[32];updateDate();generateVibe();setDynamicGreeting(currentUser)
	}
	,500)
}
window[_$_3619[33]]= function()
{
	var _0x1598B=localStorage[_$_3619[34]](_$_3619[22]);//54
	var _0x15945=localStorage[_$_3619[34]](_$_3619[24]);//55
	var _0x158B9=Date[_$_3619[25]]();//56
	if(_0x1598B&& _0x15945&& (_0x158B9- parseInt(_0x15945)< SESSION_TIMEOUT))
	{
		currentUser= _0x1598B;var _0x158FF=document[_$_3619[3]](_$_3619[27]);//61
		if(_0x158FF)
		{
			_0x158FF[_$_3619[29]][_$_3619[31]]= _$_3619[32]
		}
		//62
		updateDate();generateVibe();setDynamicGreeting(currentUser)
	}
	else 
	{
		localStorage[_$_3619[35]](_$_3619[22]);localStorage[_$_3619[35]](_$_3619[24])
	}
	
}

// Wake up the voice engine
window.speechSynthesis.getVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// 2. The Greeting Vault (Personalized)
const greetingBank = {
    morning: {
        Phesty: [
            "hope your morning’s starting easy.",
            "fresh start, fresh energy today.",
            "let’s make today count, yeah?"
        ],
        Baroness: [
            "hope the morning’s treating you gently.",
            "new day, same glow.",
            "take it slow, you’ve got time."
        ]
    },
    afternoon: {
        Phesty: [
            "midday check, still in control?",
            "hope the day’s moving your way.",
            "don’t lose that momentum now."
        ],
        Baroness: [
            "hope the day’s been kind so far.",
            "still shining through the afternoon.",
            "just a little more to go."
        ]
    },
    evening: {
        Phesty: [
            "time to ease into the night.",
            "you made it through, take it in.",
            "slow it down, you’ve done enough."
        ],
        Baroness: [
            "the evening’s calm, just like you.",
            "time to relax, you’ve earned it.",
            "let the day fade easy."
        ]
    }
};

// --- Updated Greeting & Weather Engine ---
async function setDynamicGreeting(user) {
    try {
        const hour = new Date().getHours();
        let timeOfDay = (hour >= 5 && hour < 12) ? "morning" : (hour >= 12 && hour < 17) ? "afternoon" : "evening";

        // a. Set Welcome Text (MAKE SURE THIS ID EXISTS IN HTML)
        const welcomeEl = document.getElementById('welcome-text');
        if (welcomeEl) welcomeEl.innerText = `Hi ${user}, Welcome.`;
        
        // b. Set Greeting
        const userGreetings = greetingBank[timeOfDay][user];
        const randomGreeting = userGreetings[Math.floor(Math.random() * userGreetings.length)];
        document.getElementById('dynamic-greeting').innerText = randomGreeting;

        // c. Start Clock & Weather
        startClock();
        fetchWeather(); // Call the function
    } catch (err) {
        console.error("Greeting Error:", err);
    }
}

// Add this at the top with your other variables
let dailySuggestion = "Vibing..."; 

function startClock() {
    const updateTime = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        // Update the line to include the divider and the suggestion
        document.getElementById('local-time').innerText = `${timeStr} HRS || ${dailySuggestion}`;
    };
    updateTime();
    setInterval(updateTime, 60000); 
}
async function fetchWeather() {
    // 1. If GPS works, use real location
    const success = (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        updateWeatherLogic(lat, lon);
    };

    // 2. If GPS fails, fallback to Nairobi (Default Kenya Vibe)
    const error = () => {
        console.log("GPS locked, falling back to Nairobi.");
        updateWeatherLogic(-1.2864, 36.8172, "Nairobi"); 
    };

    navigator.geolocation.getCurrentPosition(success, error);
}
// 3. The "Clutch" logic that actually pulls the data
async function updateWeatherLogic(lat, lon, forcedCity = null) {
    try {
        // Get City Name
        let cityName = forcedCity;
        if (!cityName) {
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            const geoData = await geoRes.json();
            cityName = geoData.city || geoData.locality || "Eldoret";
        }

        // Get Weather & Humidity
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m`);
        const data = await weatherRes.json();
        const weather = data.current_weather;
        const temp = Math.round(weather.temperature);
        const humid = data.hourly ? data.hourly.relative_humidity_2m[0] : "--";

        // Update the GLOBAL suggestion
        if (temp <= 18) dailySuggestion = `${cityName} is cold, stay warm! ☕`;
        else if (temp > 18 && temp < 26) dailySuggestion = `${cityName} is chill, enjoy the vibe. 🍃`;
        else dailySuggestion = `${cityName} is heating up! Keep icy. 🧊`;

        // Update Circles
        document.getElementById('temp').innerText = `${temp}°C`;
        document.getElementById('humidity').innerText = `${humid}%`;
        
        // Refresh the Status Bar (Time || Suggestion)
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
        document.getElementById('local-time').innerText = `${timeStr} HRS || ${dailySuggestion}`;
        
        // Label clean up
        document.getElementById('condition').innerText = "Temperature";
        
        setTimeout(() => {
            announceVibe();
        }, 1500);

    } catch (err) {
        console.error("Logic Error:", err);
        dailySuggestion = "Vibing Locally";
    }
}

async function announceVibe() {
    // 1. DYNAMIC DATE & TIME
    const now = new Date();
    
    const dayName = now.toLocaleDateString('en-GB', { weekday: 'long' });
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 

    // Natural minute pronunciation
    let minutesStr = "";
    if (minutes === 0) {
        minutesStr = "o'clock";
    } else if (minutes < 10) {
        minutesStr = `oh ${minutes}`;
    } else {
        minutesStr = minutes;
    }

    // More human time phrasing
    const period = ampm === 'AM' ? 'morning' : 'evening';
    const timeForVoice = `${hours} ${minutesStr} in the ${period}`;

    // 2. DATA SCRAPING
    const welcome = document.getElementById('welcome-text')?.innerText || "Hi Baroness";
    const greeting = document.getElementById('dynamic-greeting')?.innerText || "Welcome back";
    const rawStatus = document.getElementById('local-time')?.innerText || "";
    const cleanStatus = rawStatus.split('||')[1]?.trim() || "stay in your zone";

    // 3. NATURAL MESSAGE STRUCTURE (no awkward pauses, smooth flow)
    const introVariants = [
        "Quick update,",
        "Here’s where we are,",
        "Right now,"
    ];
    const intro = introVariants[Math.floor(Math.random() * introVariants.length)];

    const fullMessage = `${welcome}. ${greeting}... ${intro} it’s ${dayName}, ${dateStr},. The time is ${timeForVoice}.. Just so you know, ${cleanStatus}.`;

    // Clean emojis (keep punctuation for natural speech)
    const cleanText = fullMessage.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    // 4. ELEVENLABS CALL
    try {
        const response = await fetch('/api/speak', {
            method: 'POST',
            body: JSON.stringify({ text: cleanText })
        });

        if (!response.ok) throw new Error("API Bridge failed");

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.play();
        console.log("Vibe Announced: Smooth Human Flow 🦾");

    } catch (error) {
        console.error("AI Bridge failed, falling back to local...", error);
        
        // 5. FALLBACK (clean punctuation, no weird pauses)
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const voices = window.speechSynthesis.getVoices();
        const fallbackVoice = voices.find(v => 
            v.name.toLowerCase().includes("male") && v.lang.startsWith("en")
        );

        if (fallbackVoice) utterance.voice = fallbackVoice;
        utterance.rate = 1.0;

        window.speechSynthesis.speak(utterance);
    }
}
function startVibeParade() {
    let origin = document.querySelector('.parade-origin');
    if (!origin) {
        origin = document.createElement('div');
        origin.className = 'parade-origin';
        document.body.appendChild(origin);
    }

    const emojis = ['❤️', '💖', '✨', '🌸', '💎', '🔥', '👑'];
    
    setInterval(() => {
        const p = document.createElement('span');
        p.className = 'parade-emoji';
        p.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        
        // V-SHAPE: Spread target randomized
        const spreadWidth = (Math.random() - 0.5) * 1000; 
        p.style.setProperty('--spread', `${spreadWidth}px`);
        
        // SLOW PARADE: 8-12 seconds duration
        const duration = (Math.random() * 4 + 8) + 's';
        p.style.setProperty('--duration', duration);

        origin.appendChild(p);

        // Clean up memory
        setTimeout(() => p.remove(), 13000);
    }, 450); // Steady flow
}

// Trigger as soon as the vibe is ready
window.addEventListener('load', startVibeParade);

// 3. Core Engine (Date, Vibe, Download)
function updateDate() {
    const options = { month: 'long', weekday: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    document.getElementById('date1').innerText = today;
    document.getElementById('date2').innerText = today;
}

function generateVibe() {
    // 1. Setup & Date Logic
    const launchDate = new Date(2026, 3, 11); // April 11, 2026
    const today = new Date();
    const MASTER_SEED = 2026;

    const timeDiff = today.getTime() - launchDate.getTime();
    const daysSinceLaunch = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // 2. Deterministic Shuffle (Ensures same vibe for everyone today)
    const shuffledLoops = [...signatureLoops];
    let seed = MASTER_SEED;
    
    for (let i = shuffledLoops.length - 1; i > 0; i--) {
        seed = (seed * 9301 + 49297) % 233280;
        const j = Math.floor((seed / 233280) * (i + 1));
        [shuffledLoops[i], shuffledLoops[j]] = [shuffledLoops[j], shuffledLoops[i]];
    }

    // 3. Pick Today's Vibe
    const index = daysSinceLaunch % shuffledLoops.length;
    const vibe = shuffledLoops[index];

    // 4. Update Text Content
    document.getElementById('text1').innerText = `${vibe.part1}`;
    document.getElementById('text2').innerText = `${vibe.part2}`;

    // 5. Smart Image Loader (The Case-Sensitivity Fix)
    const loadSafeImage = (elementId, imagePath) => {
        const el = document.getElementById(elementId);
        const img = new Image();
        
        img.src = imagePath;
        
        img.onload = () => {
            el.style.backgroundImage = `url("${imagePath}")`;
        };

        img.onerror = () => {
            // Swap extension if first attempt fails
            let altPath = imagePath.endsWith('.jpg') 
                ? imagePath.replace('.jpg', '.JPG') 
                : imagePath.replace('.JPG', '.jpg');
            
            console.log(`Fallback trigger: Trying ${altPath}`);
            el.style.backgroundImage = `url("${altPath}")`;
        };
    };

    // Fire the loaders
    loadSafeImage('card1', vibe.photo1);
    loadSafeImage('card2', vibe.photo2);
}

function downloadCard(cardId, fileName) {
    const card = document.getElementById(cardId);
    const originalTransform = card.style.transform;
    card.style.transform = 'none';

    html2canvas(card, { useCORS: true, allowTaint: true, backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${fileName}-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        card.style.transform = originalTransform;
    });
}

// 4. Event Listeners & Init
document.getElementById('passcode-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPasscode(); });
