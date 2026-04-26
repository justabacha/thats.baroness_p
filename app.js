/***************************************************************************/
/*if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log("Vibe Service Worker Registered 🦾"))
    .catch((err) => console.log("SW Failed, mate:", err));
}*/

// 1. Setup & Persistence Engine
let userProfile = JSON.parse(localStorage.getItem('vibe_profile')) || null;

function handleImageUpload(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const preview = document.getElementById('avatar-preview');
        preview.style.backgroundImage = `url(${reader.result})`;
        preview.dataset.img = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

function saveSetup(choice) {
    const nameInput = document.getElementById('user-name');
    const name = nameInput.value.trim();
    const photo = document.getElementById('avatar-preview').dataset.img || "";

    if (!name) {
        nameInput.style.border = "2px solid #ff4d6d";
        return;
    }

    userProfile = { displayName: name, avatar: photo, persona: choice };
    localStorage.setItem('vibe_profile', JSON.stringify(userProfile));
    launchApp();
}

function launchApp() {
    const lockscreen = document.getElementById('lockscreen');
    if (lockscreen) {
        lockscreen.style.opacity = "0";
        setTimeout(() => lockscreen.style.display = "none", 500);
    }

    // Apply Avatar to Header
    const headerAvatar = document.getElementById('header-avatar-circle');
    if (headerAvatar && userProfile.avatar) {
        headerAvatar.style.backgroundImage = `url(${userProfile.avatar})`;
    }

    // Initialize the Vibe
    updateDate();
    generateVibe();
    // FIXED: Safe persona check
    if (userProfile && userProfile.persona) {
        setDynamicGreeting(userProfile.persona); 
    } else {
        console.warn("No user profile found, mate. Using default.");
        setDynamicGreeting('Phesty');
    }
}

window.onload = () => {
    if (userProfile) {
        // Direct launch if profile exists
        document.getElementById('lockscreen').style.display = "none";
        launchApp();
    } else {
        // Show setup if first time
        document.getElementById('lockscreen').style.display = "flex";
    }
};

let deferredPrompt;
const installModal = document.getElementById('install-modal');
const installBtn = document.getElementById('install-btn');

// This catches the 'Ready' signal from the browser
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show the modal the VERY millisecond the browser allows it
    if (installModal) {
        installModal.style.display = 'block';
        console.log("Install prompt is ready to go, blud! 🚀");
    }
});

// The actual install action
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User vibe: ${outcome}`);
        deferredPrompt = null;
        installModal.style.display = 'none';
    });
}

// Close button logic
const closeBtn = document.getElementById('close-modal');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        installModal.style.display = 'none';
    });
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

        // a. Set Welcome Text
       const welcomeEl = document.getElementById('welcome-text');
        if (welcomeEl && userProfile) {
            welcomeEl.innerText = `Hi ${userProfile.displayName}, Welcome back.`;
        }
        // b. Set Greeting (FIXED: safe persona fallback)
        const persona = user || (userProfile ? userProfile.persona : 'Phesty');
        const userGreetings = greetingBank[timeOfDay][persona] || greetingBank[timeOfDay]['Phesty'];
        const randomGreeting = userGreetings[Math.floor(Math.random() * userGreetings.length)];
        const greetingEl = document.getElementById('dynamic-greeting');
        if (greetingEl) greetingEl.innerText = randomGreeting;

        // c. Start Clock & Weather
        startClock();
        fetchWeather();
    } catch (err) {
        console.error("Greeting Error:", err);
    }
}

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
// 1. Open Settings (Recall the Lockscreen)
function openSettings() {
    const lockscreen = document.getElementById('lockscreen');
    const nameInput = document.getElementById('user-name');
    const preview = document.getElementById('avatar-preview');

    // Pre-fill with current data so they don't start from scratch
    if (userProfile) {
        nameInput.value = userProfile.displayName;
        if (userProfile.avatar) {
            preview.style.backgroundImage = `url(${userProfile.avatar})`;
            preview.dataset.img = userProfile.avatar;
        }
    }

    lockscreen.style.display = "flex";
    setTimeout(() => {
        lockscreen.style.opacity = "1";
    }, 10);
}

// 2. Modified saveSetup (To handle the 'Burn & Adapt' logic)
// We use the same saveSetup function but ensure it refreshes the UI
function saveSetup(choice) {
    const nameInput = document.getElementById('user-name');
    const name = nameInput.value.trim();
    const photo = document.getElementById('avatar-preview').dataset.img || "";

    if (!name) {
        nameInput.style.border = "2px solid #ff4d6d";
        return;
    }

    // THE BURN: Overwrite the existing object in localStorage
    userProfile = { 
        displayName: name, 
        avatar: photo, 
        persona: choice 
    };
    
    localStorage.setItem('vibe_profile', JSON.stringify(userProfile));

    // THE ADAPT: Immediate UI Refresh
    const headerAvatar = document.getElementById('header-avatar-circle');
    if (headerAvatar && userProfile.avatar) {
        headerAvatar.style.backgroundImage = `url(${userProfile.avatar})`;
    }

    // Re-run the greeting engine with the NEW persona and name
    setDynamicGreeting(userProfile.persona);
    
    // Close the layer
    const lockscreen = document.getElementById('lockscreen');
    lockscreen.style.opacity = "0";
    setTimeout(() => {
        lockscreen.style.display = "none";
    }, 500);
    
    console.log("Vibe updated and adapted, blud! 🦾");
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

    // 2. DATA SCRAPING (FIXED: safe welcome text)
    const welcome = userProfile ? `Hi ${userProfile.displayName}` : (document.getElementById('welcome-text')?.innerText || "Hi there");
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
    if (!card) return;

    // 1. Get the actual visual space the tilted card takes up
    const rect = card.getBoundingClientRect();

    html2canvas(card, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        // 2. SCALE 3 or 4 gives "Retina/HD" crispness
        scale: 3, 
        logging: false,
        // 3. Ensure we capture the full tilted dimensions
        width: rect.width,
        height: rect.height,
        scrollX: 0,
        scrollY: -window.scrollY,
        // 4. Force high-quality image rendering
        imageTimeout: 0,
        onclone: (clonedDoc) => {
            // This ensures the cloned card is visible for the "camera"
            const clonedCard = clonedDoc.getElementById(cardId);
            clonedCard.style.margin = "0";
        }
    }).then(canvas => {
        // 5. Convert to High-Quality Blob for better reliability than DataURL
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `${fileName}-${Date.now()}.png`;
            link.href = url;
            link.click();
            
            // Cleanup memory
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 'image/png', 1.0); // 1.0 is max quality
    }).catch(err => {
        console.error("HD Capture failed, mate:", err);
    });
}

// 4. Event Listeners & Init (FIXED: safe event listener)
const passInput = document.getElementById('passcode-input');
if (passInput) {
    passInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPasscode(); });
}