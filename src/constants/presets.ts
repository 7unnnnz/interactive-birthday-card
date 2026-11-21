import { MusicPreset, CardData } from '../types/card';

const base = import.meta.env.BASE_URL || './';
const audioBase = base.endsWith('/') ? base : `${base}/`;

export const MUSIC_PRESETS: MusicPreset[] = [
  {
    id: 'piano-acoustic',
    name: 'Acoustic Piano Birthday',
    genre: 'Dịu dàng & Ấm áp',
    url: `${audioBase}audio/piano-birthday.wav`,
    isBuiltIn: true
  },
  {
    id: 'music-box',
    name: 'Music Box Melody',
    genre: 'Trong trẻo & Hoài niệm',
    url: `${audioBase}audio/musicbox-birthday.wav`,
    isBuiltIn: true
  },
  {
    id: 'lofi-chill',
    name: 'Lo-Fi Chill Starlight',
    genre: 'Thư giãn & Hiện đại',
    url: `${audioBase}audio/lofi-birthday.wav`,
    isBuiltIn: true
  }
];

export const DEFAULT_CARD_DATA: CardData = {
  title: 'Chúc Mừng Sinh Nhật!',
  subtitle: 'Gửi người bạn thân thương nhất',
  message: 'Chúc bạn một tuổi mới ngập tràn niềm vui, luôn rạng rỡ như 5 ngọn nến lung linh và ngát hương như đóa hoa ly rực rỡ nhất.\n\nCảm ơn vì đã luôn là một điều ngọt ngào tuyệt vời trong thế giới này! ✨🎂🌸',
  images: [
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80'
  ],
  musicPreset: 'piano-acoustic',
  musicUrl: `${audioBase}audio/piano-birthday.wav`,
  theme: 'velvet',
  createdAt: Date.now()
};
