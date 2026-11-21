/**
 * Web Audio API Chime/Music Box Synthesizer
 * Tự động tổng hợp giai điệu Happy Birthday du dương bằng âm thanh chuông ngân nga (chimes)
 * Không phụ thuộc file MP3 ngoại tuyến, chạy 100% không bao giờ lỗi mạng.
 */

// Giai điệu Happy Birthday: [Tần số Hz, Độ dài nốt tính bằng giây]
// C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46
const G4 = 392.00;
const A4 = 440.00;
const B4 = 493.88;
const C5 = 523.25;
const D5 = 587.33;
const E5 = 659.25;
const F5 = 698.46;

const NOTES: Array<{ freq: number; dur: number; pause: number }> = [
  // Happy Birthday to you
  { freq: G4, dur: 0.35, pause: 0.1 },
  { freq: G4, dur: 0.35, pause: 0.1 },
  { freq: A4, dur: 0.7, pause: 0.1 },
  { freq: G4, dur: 0.7, pause: 0.1 },
  { freq: C5, dur: 0.7, pause: 0.1 },
  { freq: B4, dur: 1.2, pause: 0.3 },

  // Happy Birthday to you
  { freq: G4, dur: 0.35, pause: 0.1 },
  { freq: G4, dur: 0.35, pause: 0.1 },
  { freq: A4, dur: 0.7, pause: 0.1 },
  { freq: G4, dur: 0.7, pause: 0.1 },
  { freq: D5, dur: 0.7, pause: 0.1 },
  { freq: C5, dur: 1.2, pause: 0.3 },

  // Happy Birthday dear friend
  { freq: G4, dur: 0.35, pause: 0.1 },
  { freq: G4, dur: 0.35, pause: 0.1 },
  { freq: G4 * 2, dur: 0.7, pause: 0.1 }, // G5
  { freq: E5, dur: 0.7, pause: 0.1 },
  { freq: C5, dur: 0.7, pause: 0.1 },
  { freq: B4, dur: 0.7, pause: 0.1 },
  { freq: A4, dur: 1.2, pause: 0.3 },

  // Happy Birthday to you
  { freq: F5, dur: 0.35, pause: 0.1 },
  { freq: F5, dur: 0.35, pause: 0.1 },
  { freq: E5, dur: 0.7, pause: 0.1 },
  { freq: C5, dur: 0.7, pause: 0.1 },
  { freq: D5, dur: 0.7, pause: 0.1 },
  { freq: C5, dur: 1.8, pause: 1.0 },
];

export class BirthdaySynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timeoutId: number | null = null;
  private currentNoteIndex = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.playNextNote();
  }

  private playNextNote() {
    if (!this.isPlaying || !this.ctx) return;

    const note = NOTES[this.currentNoteIndex];
    this.playChimeTone(note.freq, note.dur);

    const totalDuration = (note.dur + note.pause) * 1000;
    this.timeoutId = window.setTimeout(() => {
      this.currentNoteIndex = (this.currentNoteIndex + 1) % NOTES.length;
      this.playNextNote();
    }, totalDuration);
  }

  private playChimeTone(freq: number, duration: number) {
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Tạo 2 oscillator kết hợp tạo hiệu ứng âm thanh chuông hộp nhạc Music Box
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now); // Bội âm nhẹ

    // Envelope âm lượng: bật nhanh, suy giảm chậm êm ái
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.5);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.6);
    osc2.stop(now + duration + 0.6);
  }

  public pause() {
    this.isPlaying = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  public stop() {
    this.pause();
    this.currentNoteIndex = 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const birthdaySynth = new BirthdaySynthesizer();
