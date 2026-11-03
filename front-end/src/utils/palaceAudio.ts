/**
 * Bộ tạo âm thanh thủ tục (Procedural Audio Synthesizer) cho Hoàng Cung Đại Nghiệp
 * Sử dụng Web Audio API tích hợp sẵn trong trình duyệt (Zero-dependency, không cần tải file mp3).
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Phát tiếng Chuông Đồng Thái Hòa Điện ngân vang (Ceremonial Bronze Bell)
 */
export function playCourtChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Hài âm chuông đồng cổ truyền (520Hz, 1040Hz, 1560Hz, 2080Hz)
    const freqs = [520, 1040, 1560, 2080];
    const gains = [0.28, 0.14, 0.08, 0.04];
    const decays = [3.8, 2.6, 1.8, 1.2];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gains[idx], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[idx]);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decays[idx]);
    });
  } catch {
    // Trình duyệt chặn autoplay audio khi chưa có thao tác click
  }
}

/**
 * Phát tiếng Khánh Ngọc khai triều (Jade Chime)
 */
export function playJadeChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.8);
  } catch {
    // Ignore
  }
}
