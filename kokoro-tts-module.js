import { KokoroTTS } from "kokoro-js";

let ttsInstance = null;
let isLoading = false;
let loadPromise = null;

// Reliable voice from the Q8 model
const VOICE = "am_adam";

// Simple text cleaner (numbers, etc.)
function cleanText(raw) {
    return raw
        .replace(/\b(\d{1,2}):(\d{2})\b/g, (_, h, m) => `${h} ${m === '00' ? 'o clock' : m}`)
        .replace(/\b(\d+)km\/h\b/g, (_, num) => `${num} kilometers per hour`)
        .replace(/Dr\./g, 'Doctor')
        .replace(/\b(\d{4})\b/g, (_, year) => year.split('').join(' '))
        .trim();
}

// Load model (Q8, wasm) – only once
async function loadModel(onProgress) {
    if (ttsInstance) return ttsInstance;
    if (isLoading && loadPromise) return loadPromise;
    
    isLoading = true;
    console.log("🔄 Loading Kokoro Q8 model...");
    
    loadPromise = (async () => {
        const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";
        const instance = await KokoroTTS.from_pretrained(model_id, {
            dtype: "q8",
            device: "wasm",
            progress_callback: onProgress
        });
        console.log("✅ Kokoro ready");
        return instance;
    })();
    
    ttsInstance = await loadPromise;
    isLoading = false;
    return ttsInstance;
}

// Speak function
async function speakWithKokoro(text, onProgress) {
    const model = await loadModel(onProgress);
    const cleaned = cleanText(text);
    console.log("🗣️ Speaking:", cleaned);
    
    const audio = await model.generate(cleaned, { voice: VOICE, speed: 1.0 });
    const blob = await audio.toBlob();
    const url = URL.createObjectURL(blob);
    const player = new Audio(url);
    
    return new Promise((resolve, reject) => {
        player.onended = () => {
            URL.revokeObjectURL(url);
            resolve();
        };
        player.onerror = (err) => {
            URL.revokeObjectURL(url);
            reject(err);
        };
        player.play().catch(reject);
    });
}

// Expose a global function your existing app.js can call
window.kokoroSpeak = async (text, onProgress) => {
    try {
        await speakWithKokoro(text, onProgress);
        return true;
    } catch (err) {
        console.error("Kokoro error:", err);
        return false;
    }
};