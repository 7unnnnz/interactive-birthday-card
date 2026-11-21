import React, { useState, useEffect } from 'react';
import { CardData } from '../../types/card';
import { DEFAULT_CARD_DATA, MUSIC_PRESETS } from '../../constants/presets';
import { compressImage } from '../../utils/imageCompressor';
import { uploadMediaToCloud } from '../../utils/supabase';
import { generateCardShareUrl } from '../../utils/compressor';
import { AudioSelector } from './AudioSelector';
import { QRModal } from './QRModal';
import {
  Sparkles,
  ImagePlus,
  Trash2,
  QrCode,
  Wand2,
  Heart,
  Eye,
  CheckCircle2,
  X,
  Play
} from 'lucide-react';

interface CardCreatorProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialData?: CardData;
  onApplyCard?: (newCard: CardData) => void;
}

export const CardCreator: React.FC<CardCreatorProps> = ({
  isOpen = true,
  onClose,
  initialData,
  onApplyCard,
}) => {
  const [formData, setFormData] = useState<CardData>(initialData || DEFAULT_CARD_DATA);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    initialData?.musicPreset || 'piano-acoustic'
  );
  const [isCompressingImages, setIsCompressingImages] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.musicPreset) {
        setSelectedPresetId(initialData.musicPreset);
      }
    }
  }, [initialData]);

  if (!isOpen) return null;

  // Xử lý upload ảnh (kéo thả hoặc chọn file)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressingImages(true);
    const newImageUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Thử tải lên Supabase Storage nếu có cấu hình
        const cloudUrl = await uploadMediaToCloud(file, 'images', file.name);

        if (cloudUrl) {
          newImageUrls.push(cloudUrl);
        } else {
          // 2. Tự động nén qua HTML Canvas tạo ảnh siêu nhẹ để nhúng vào URL hash
          const compressedDataUrl = await compressImage(file, 640, 640, 0.72);
          newImageUrls.push(compressedDataUrl);
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImageUrls],
      }));
    } catch (err) {
      console.error('Lỗi khi nén hoặc tải ảnh:', err);
    } finally {
      setIsCompressingImages(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAudioSelect = (presetId: string, url: string) => {
    setSelectedPresetId(presetId);
    setFormData((prev) => ({
      ...prev,
      musicPreset: presetId,
      musicUrl: url,
    }));
  };

  const handleFillTemplate = () => {
    setFormData({
      ...DEFAULT_CARD_DATA,
      createdAt: Date.now(),
    });
    setSelectedPresetId('piano-acoustic');
  };

  const handleGenerateCard = () => {
    const cardToSave: CardData = {
      ...formData,
      createdAt: Date.now(),
    };
    const url = generateCardShareUrl(cardToSave);
    setShareUrl(url);
    setIsQRModalOpen(true);

    if (onApplyCard) {
      onApplyCard(cardToSave);
    }

    const hashMatch = url.match(/#card=.+/);
    if (hashMatch) {
      window.history.replaceState(null, '', hashMatch[0]);
    }
  };

  const handleApplyAndClose = () => {
    const cardToSave: CardData = {
      ...formData,
      createdAt: Date.now(),
    };
    if (onApplyCard) {
      onApplyCard(cardToSave);
    }
    const url = generateCardShareUrl(cardToSave);
    const hashMatch = url.match(/#card=.+/);
    if (hashMatch) {
      window.history.replaceState(null, '', hashMatch[0]);
    }
    if (onClose) {
      onClose();
    }
  };

  const content = (
    <div className="min-h-screen sm:min-h-0 w-full max-w-5xl mx-auto py-6 px-3 sm:px-6 relative">
      {/* Nút đóng modal nếu ở chế độ popup */}
      {onClose && (
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-midnight-800/90 hover:bg-midnight-700 text-slate-300 hover:text-white border border-white/20 shadow-xl transition-all cursor-pointer"
          title="Đóng studio"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Vòng sáng nền mờ trang trí */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div>
        {/* Header giới thiệu */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-400/25 text-rose-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Studio Tạo Thiệp Sinh Nhật 3D & Mã QR</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gold-300 via-rose-200 to-gold-400 bg-clip-text text-transparent font-script tracking-wide">
            Interactive Birthday Card Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl mx-auto font-light">
            Nhập thông tin thiệp sinh nhật của bạn, chọn nhạc và ảnh kỷ niệm để tạo mã QR chia sẻ cho bạn bè.
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 mt-3.5">
            <button
              type="button"
              onClick={handleFillTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gold-300 font-medium transition-all cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Dùng lời chúc mẫu</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={handleApplyAndClose}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-xs text-rose-200 font-medium transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-rose-300" />
                <span>Áp dụng & Xem thiệp ngay</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-rose-300 font-medium transition-all lg:hidden cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showLivePreview ? 'Ẩn xem trước' : 'Xem trước thiệp'}</span>
            </button>
          </div>
        </div>

        {/* Nội dung chính: Form nhập liệu & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cột Trái: Form nhập liệu (7 cột) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400/40" />
                Thông Tin Tấm Thiệp
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Nhập lời chúc và thông điệp bạn muốn gửi gắm tới người nhận
              </p>
            </div>

            {/* 1. Lời chúc tiêu đề */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300 mb-2">
                1. Lời chúc tiêu đề
              </label>
              <input
                type="text"
                placeholder="VD: Chúc Mừng Sinh Nhật Minh Anh!"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl glass-input text-sm font-medium focus:border-rose-400"
              />
            </div>

            {/* 2. Tiêu đề lời nhắn */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300 mb-2">
                2. Tiêu đề lời nhắn
              </label>
              <input
                type="text"
                placeholder="VD: Gửi người bạn tuyệt vời nhất"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl glass-input text-sm focus:border-rose-400"
              />
            </div>

            {/* 3. Lời nhắn chi tiết */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300 mb-2">
                3. Lời nhắn chân thành
              </label>
              <textarea
                rows={4}
                placeholder="Nhập những lời chúc ý nghĩa, kỷ niệm hoặc điều ước tốt lành dành cho người nhận..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl glass-input text-sm leading-relaxed focus:border-rose-400 resize-none"
              />
            </div>

            {/* 4. Thêm ảnh kỷ niệm */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gold-300">
                  4. Ảnh kỷ niệm ({formData.images.length})
                </label>
                {isCompressingImages && (
                  <span className="text-[11px] text-rose-300 animate-pulse">
                    Đang nén ảnh tối ưu...
                  </span>
                )}
              </div>

              {/* Danh sách ảnh đã chọn */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                  {formData.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden aspect-square border border-white/20 bg-midnight-950"
                    >
                      <img
                        src={imgUrl}
                        alt={`Ảnh ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition-opacity"
                        title="Xóa ảnh này"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Ô bấm tải ảnh lên */}
              <label className="flex flex-col items-center justify-center p-4 rounded-2xl border border-dashed border-white/25 hover:border-gold-400/50 bg-midnight-950/40 hover:bg-midnight-950/60 transition-all cursor-pointer">
                <ImagePlus className="w-6 h-6 text-gold-300 mb-1.5" />
                <span className="text-xs font-medium text-slate-200">
                  Tải lên ảnh từ thiết bị
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-light">
                  Tự động tối ưu dung lượng cho điện thoại di động
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* 5. Nhạc nền sinh nhật */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300 mb-2">
                5. Nhạc nền chúc mừng sinh nhật
              </label>
              <AudioSelector
                selectedPresetId={selectedPresetId}
                customMusicUrl={formData.musicUrl}
                onSelect={handleAudioSelect}
              />
            </div>

            {/* Nút Tạo Thiệp & Mã QR */}
            <div className="pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleGenerateCard}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-gold-300 via-rose-300 to-gold-400 hover:from-gold-400 hover:to-rose-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-gold-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <QrCode className="w-5 h-5 text-slate-950" />
                <span>Tạo Thiệp & Sinh Mã QR</span>
              </button>
            </div>
          </div>

          {/* Cột Phải: Live Preview Khung Thiệp (5 cột) */}
          <div
            className={`lg:col-span-5 ${
              showLivePreview ? 'block' : 'hidden lg:block'
            } sticky top-6`}
          >
            <div className="glass-panel-gold rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  Khung Xem Trước (Live Preview)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                  Mobile Ready
                </span>
              </div>

              {/* Giả lập thiệp khi người nhận mở */}
              <div className="text-center py-2">
                <h3 className="text-2xl font-bold font-script bg-gradient-to-r from-gold-300 to-rose-200 bg-clip-text text-transparent">
                  {formData.title || 'Chúc Mừng Sinh Nhật!'}
                </h3>
                <p className="text-xs text-gold-200/80 font-medium mt-1">
                  {formData.subtitle || 'Tiêu đề lời nhắn của bạn'}
                </p>
              </div>

              {/* Khung ảnh xem trước */}
              {formData.images.length > 0 && (
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-midnight-950 border border-white/15">
                  <img
                    src={formData.images[0]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {formData.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] text-white">
                      +{formData.images.length - 1} ảnh nữa
                    </div>
                  )}
                </div>
              )}

              {/* Lời nhắn xem trước */}
              <div className="p-4 rounded-xl bg-midnight-950/60 border border-white/10 text-xs text-slate-300 leading-relaxed whitespace-pre-line font-light max-h-40 overflow-y-auto">
                {formData.message || 'Nội dung lời nhắn sẽ xuất hiện ở đây...'}
              </div>

              {/* Thông tin nhạc xem trước */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 text-[11px] text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span className="truncate">
                  Nhạc nền:{' '}
                  {MUSIC_PRESETS.find((p) => p.id === selectedPresetId)?.name ||
                    'Nhạc tự chọn'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal hiển thị mã QR */}
      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        shareUrl={shareUrl}
      />
    </div>
  );

  return onClose ? (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {content}
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-midnight-950 via-midnight-900 to-midnight-800 text-slate-100">
      {content}
    </div>
  );
};
