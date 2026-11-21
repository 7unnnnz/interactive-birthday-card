import fs from 'fs';
import path from 'path';

const SAMPLE_RATE = 44100;

// Notes frequencies (Hz)
const G3 = 196.00, A3 = 220.00, B3 = 246.94;
const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00;

// Happy Birthday Melody
const MELODY = [
  { freq: G4, dur: 0.35, rest: 0.1 },
  { freq: G4, dur: 0.35, rest: 0.1 },
  { freq: A4, dur: 0.75, rest: 0.1 },
  { freq: G4, dur: 0.75, rest: 0.1 },
  { freq: C5, dur: 0.75, rest: 0.1 },
  { freq: B4, dur: 1.30, rest: 0.3 },

  { freq: G4, dur: 0.35, rest: 0.1 },
  { freq: G4, dur: 0.35, rest: 0.1 },
  { freq: A4, dur: 0.75, rest: 0.1 },
  { freq: G4, dur: 0.75, rest: 0.1 },
  { freq: D5, dur: 0.75, rest: 0.1 },
  { freq: C5, dur: 1.30, rest: 0.3 },

  { freq: G4, dur: 0.35, rest: 0.1 },
  { freq: G4, dur: 0.35, rest: 0.1 },
  { freq: G5, dur: 0.75, rest: 0.1 },
  { freq: E5, dur: 0.75, rest: 0.1 },
  { freq: C5, dur: 0.75, rest: 0.1 },
  { freq: B4, dur: 0.75, rest: 0.1 },
  { freq: A4, dur: 1.30, rest: 0.3 },

  { freq: F5, dur: 0.35, rest: 0.1 },
  { freq: F5, dur: 0.35, rest: 0.1 },
  { freq: E5, dur: 0.75, rest: 0.1 },
  { freq: C5, dur: 0.75, rest: 0.1 },
  { freq: D5, dur: 0.75, rest: 0.1 },
  { freq: C5, dur: 2.00, rest: 1.0 },
];

function generateWav(melody, style = 'chime') {
  let totalDuration = melody.reduce((acc, n) => acc + n.dur + n.rest, 0);
  const totalSamples = Math.floor(totalDuration * SAMPLE_RATE);
  const buffer = new Float32Array(totalSamples);

  let sampleOffset = 0;

  for (const note of melody) {
    const noteSamples = Math.floor(note.dur * SAMPLE_RATE);
    const decaySamples = Math.floor(note.dur * 1.5 * SAMPLE_RATE);

    for (let i = 0; i < decaySamples && (sampleOffset + i) < totalSamples; i++) {
      const t = i / SAMPLE_RATE;
      let sample = 0;

      if (style === 'chime') {
        // Hộp nhạc music box: sine + bội âm cao ngân dài
        const env = Math.exp(-t * 2.8);
        sample = (
          Math.sin(2 * Math.PI * note.freq * t) * 0.6 +
          Math.sin(2 * Math.PI * note.freq * 2.01 * t) * 0.3 +
          Math.sin(2 * Math.PI * note.freq * 3.0 * t) * 0.15
        ) * env;
      } else if (style === 'piano') {
        // Piano mộc: âm ấm, attack gõ búa nhẹ
        const env = Math.exp(-t * 3.2);
        const attack = Math.min(1.0, t * 150);
        sample = (
          Math.sin(2 * Math.PI * note.freq * t) * 0.7 +
          Math.sin(2 * Math.PI * note.freq * 2.0 * t) * 0.2 +
          Math.sin(2 * Math.PI * (note.freq / 2) * t) * 0.2
        ) * env * attack;
      } else {
        // Lo-fi ấm áp: hòa âm tam giác và lọc mềm
        const env = Math.exp(-t * 2.2);
        sample = (
          Math.sin(2 * Math.PI * note.freq * t) * 0.5 +
          Math.sin(2 * Math.PI * (note.freq * 1.5) * t) * 0.2 +
          Math.sin(2 * Math.PI * (note.freq / 2) * t) * 0.3
        ) * env;
      }

      buffer[sampleOffset + i] += sample * 0.35;
    }

    sampleOffset += Math.floor((note.dur + note.rest) * SAMPLE_RATE);
  }

  // Tạo file WAV 16-bit PCM
  const wavBuffer = Buffer.alloc(44 + totalSamples * 2);
  wavBuffer.write('RIFF', 0);
  wavBuffer.writeUInt32LE(36 + totalSamples * 2, 4);
  wavBuffer.write('WAVE', 8);
  wavBuffer.write('fmt ', 12);
  wavBuffer.writeUInt32LE(16, 16); // Subchunk1Size
  wavBuffer.writeUInt16LE(1, 20);  // PCM = 1
  wavBuffer.writeUInt16LE(1, 22);  // Mono = 1
  wavBuffer.writeUInt32LE(SAMPLE_RATE, 24);
  wavBuffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // ByteRate
  wavBuffer.writeUInt16LE(2, 32);  // BlockAlign
  wavBuffer.writeUInt16LE(16, 34); // BitsPerSample
  wavBuffer.write('data', 36);
  wavBuffer.writeUInt32LE(totalSamples * 2, 40);

  for (let i = 0; i < totalSamples; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]));
    const int16 = s < 0 ? s * 0x8000 : s * 0x7FFF;
    wavBuffer.writeInt16LE(Math.floor(int16), 44 + i * 2);
  }

  return wavBuffer;
}

const outDir = path.resolve('public/audio');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'piano-birthday.wav'), generateWav(MELODY, 'piano'));
fs.writeFileSync(path.join(outDir, 'musicbox-birthday.wav'), generateWav(MELODY, 'chime'));
fs.writeFileSync(path.join(outDir, 'lofi-birthday.wav'), generateWav(MELODY, 'lofi'));

console.log('Generated 3 birthday audio files successfully in public/audio/');
