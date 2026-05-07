import { KokoroTTS } from "kokoro-js";

let ttsInstance = null;
let isLoading = false;
let loadPromise = null;

// Use a reliable voice that exists in the Q8 model
const DEFAULT_VOICE = "am_adam";  // American male – change later if you want

// Text cleaner (numbers, abbreviations)
function normalizeTextForTTS(raw) {
    return raw
        .replace(/\b(\d{1,2}):(\d{2})\b/g, (_, h, m) => `${h} ${m === '00' ? 'o clock' : m}`)
        .replace(/\b(\d+)km\/h\b/g, (_, num) => `${num} kilometres per hour`)
        .replace(/Dr\./g, 'Doctor')
        .replace(/\b(\d{4})\b/g, (_, year) => year.split('').join(' '))
        .trim();
}

// Load the Q8 model (idempotent)
export async function loadKokoroModel(onProgress) {
    if (ttsInstance) return ttsInstance;
    if (isLoading && loadPromise) return loadPromise;

    isLoading = true;
    console.log("🔄 Loading Kokoro Q8 model (~100MB) ...");

    loadPromise = (async () => {
        try {
            const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";
            ttsInstance = await KokoroTTS.from_pretrained(model_id, {
                dtype: "q8",      // 8‑bit quantized – mobile friendly
                device: "wasm",   // WebAssembly – most compatible
                progress_callback: onProgress
            });
            console.log("✅ Kokoro model ready");
            console.log("Available voices:", await ttsInstance.list_voices());
            return ttsInstance;
        } catch (err) {
            console.error("❌ Kokoro load failed", err);
            throw err;
        } finally {
            isLoading = false;
        }
    })();

    return loadPromise;
}

// Speak with the loaded model
export async function speakWithKokoro(text, options = {}) {
    if (!ttsInstance) {
        throw new Error("Model not loaded. Call loadKokoroModel() first.");
    }
    const clean = normalizeTextForTTS(text);
    console.log("🗣️ Kokoro speaking:", clean);

    const audio = await ttsInstance.generate(clean, {
        voice: options.voice || DEFAULT_VOICE,
        speed: options.speed || 1.0,
    });

    // Convert to a playable blob
    const wavBlob = await audio.toBlob();
    const url = URL.createObjectURL(wavBlob);
    const player = new Audio(url);
    
    // Return a promise that resolves when playback finishes
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