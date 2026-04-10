// 1. Handle the Date (Top Left Corner)
function updateDate() {
    const options = { month: 'long', weekday: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    
    document.getElementById('date1').innerText = today;
    document.getElementById('date2').innerText = today;
}

// 2. Randomize the Vibe
function generateVibe() {
    const randomIndex = Math.floor(Math.random() * signatureLoops.length);
    const vibe = signatureLoops[randomIndex];

    // Update Text
    document.getElementById('text1').innerText = `"${vibe.part1}"`;
    document.getElementById('text2').innerText = `"${vibe.part2}"`;

    // Update GitHub Background Photos
    document.getElementById('card1').style.backgroundImage = `url('${vibe.photo1}')`;
    document.getElementById('card2').style.backgroundImage = `url('${vibe.photo2}')`;
}
// Function to download a specific card
function downloadCard(cardId, fileName) {
    const card = document.getElementById(cardId);
    
    // We temporarily remove the tilt so the image saves straight
    const originalTransform = card.style.transform;
    card.style.transform = 'none';

    html2canvas(card, {
        useCORS: true, // Allows fetching images from GitHub/External folders
        allowTaint: true,
        backgroundColor: null // Keeps corners rounded if needed
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${fileName}-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        // Put the tilt back after saving
        card.style.transform = originalTransform;
    });
}
// 3. Event Listeners
document.getElementById('randomize-btn').addEventListener('click', generateVibe);

// Initialize on Load
window.onload = () => {
    updateDate();
    generateVibe();
};
// 1. The Greeting Vault
const greetingBank = {
    morning: [
        "Hey B, how is your morning starting?",
        "Sun is out, how are you feeling today?",
        "Morning, bestie. Ready for a new vibe?",
        "Fresh start, fresh loop. Rise and shine!"
    ],
    afternoon: [
        "Good afternoon! Hope the day is treating you right.",
        "Mid-day energy check... how we feeling?",
        "Lunchtime vibes are the best vibes.",
        "Still winning today?"
    ],
    evening: [
        "Evening, Phesty & Baroness. Time to wind down.",
        "The stars are out, and so is the vibe.",
        "Night owl energy activated. 🦉",
        "Reflecting on a day well spent..."
    ]
};

// 2. The Dynamic Greeting Function
function setDynamicGreeting() {
    const hour = new Date().getHours();
    let timeOfDay;

    if (hour >= 5 && hour < 12) {
        timeOfDay = "morning";
    } else if (hour >= 12 && hour < 17) {
        timeOfDay = "afternoon";
    } else {
        timeOfDay = "evening";
    }

    // Pick a random greeting from the right category
    const greetings = greetingBank[timeOfDay];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    // Push it to the HTML
    document.getElementById('dynamic-greeting').innerText = randomGreeting;
}

// 3. Update window.onload to include the greeting
window.onload = () => {
    updateDate();
    generateVibe();
    setDynamicGreeting(); // This fires the magic!
};