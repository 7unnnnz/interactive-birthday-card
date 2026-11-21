export interface CardData {
  title: string;          // Lời chúc tiêu đề (VD: Chúc mừng sinh nhật Minh Anh!)
  subtitle: string;       // Tiêu đề lời nhắn (VD: Gửi người bạn tuyệt vời nhất)
  message: string;        // Lời nhắn chi tiết (hỗ trợ xuống dòng)
  images: string[];       // Danh sách URL ảnh hoặc Data URL nén
  musicUrl?: string;      // URL bài hát tùy chỉnh hoặc preset
  musicPreset?: string;   // Tên hoặc ID preset nhạc
  theme?: 'velvet' | 'golden' | 'rose'; // Tông màu chủ đạo
  createdAt?: number;
}

export type ScenePhase = 
  | 'gate'        // Màn hình chờ mở quà (unlock audio context)
  | 'cake'        // Bánh kem hạt 3D lung linh
  | 'morphing'    // Chuyển động xoáy hạt biến thành hoa
  | 'flower'      // Hoa nở rộ + Pháo hoa hạt
  | 'revealed';   // Hoa làm nền + Hiện card lời chúc Glassmorphism

export interface MusicPreset {
  id: string;
  name: string;
  genre: string;
  url: string;
  isBuiltIn?: boolean;
}
