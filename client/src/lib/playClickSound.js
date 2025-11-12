// Simple click sound using Web Audio API
export function playClickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Sine wave for base tone
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 660;
    // Triangle wave for shimmer
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = 880;
    // Gain for fade-out
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.22);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.22);
    osc2.stop(ctx.currentTime + 0.22);
    osc2.onended = () => ctx.close();
  } catch (e) {
    // Fail silently if browser doesn't support
  }
}
