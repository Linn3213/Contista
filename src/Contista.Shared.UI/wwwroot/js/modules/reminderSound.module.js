// wwwroot/js/modules/reminderSound.module.js
let unlocked = false;

let audio = null;          // HTMLAudioElement
let audioCtx = null;       // AudioContext

function ensureAudio(src) {
    if (audio) return audio;

    audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = 0.6;
    return audio;
}

function ensureAudioCtx() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    if (!audioCtx) audioCtx = new AudioCtx();
    return audioCtx;
}

async function tryPlayFile(src) {
    const a = ensureAudio(src);

    // starta från början varje gång (kort ljud)
    try { a.currentTime = 0; } catch { /* ignore */ }

    await a.play();
}

function beep() {
    const ctx = ensureAudioCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 880;

    // mjuk ramp (undvik klick)
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
}

async function unlock(src = "/audio/reminder.mp3") {
    unlocked = true;

    // Prime HTMLAudio så autoplay-blockering släpper efter user gesture
    try {
        const a = ensureAudio(src);
        const prevVol = a.volume;

        a.volume = 0.0001;
        try { a.currentTime = 0; } catch { /* ignore */ }

        await a.play();
        a.pause();
        a.volume = prevVol;
    } catch {
        // ignore
    }

    // Prime WebAudio (resume)
    try {
        const ctx = ensureAudioCtx();
        if (ctx && ctx.state === "suspended") {
            await ctx.resume();
        }
    } catch {
        // ignore
    }
}

async function play(opts = {}) {
    const src = opts.src || "/audio/reminder.mp3";
    const preferBeep = opts.preferBeep === true;

    // Om du vill köra beep alltid:
    if (preferBeep) {
        try {
            beep();
            return { ok: true, method: "beep" };
        } catch {
            return { ok: false, method: "beep" };
        }
    }

    // Försök fil först
    try {
        // Om inte upplåst än: vi försöker ändå, kan funka beroende på browser
        await tryPlayFile(src);
        unlocked = true;
        return { ok: true, method: "file" };
    } catch {
        // Fallback beep
        try {
            beep();
            return { ok: false, method: "beep_fallback" };
        } catch {
            return { ok: false, method: "blocked" };
        }
    }
}

export const reminderSound = {
    unlock,
    play
};