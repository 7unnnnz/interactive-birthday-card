import React, { useState } from 'react';
import { CardData } from '../../types/card';
import { ChevronLeft, ChevronRight, Heart, Sparkles, X, Maximize2 } from 'lucide-react';

interface GreetingCardProps {
  cardData: CardData;
  onReplay?: () => void;
  onOpenStudio?: () => void;
}

export const GreetingCard: React.FC<GreetingCardProps> = ({ cardData, onReplay, onOpenStudio }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false);

  const images = cardData.images && cardData.images.length > 0 ? cardData.images : [];

  const handleNextImg = () => {
    if (images.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImg = () => {
    if (images.length > 1) {
      setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel-gold text-gold-300 hover:text-white font-medium text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>Xem Lời Chúc & Album Ảnh</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-8 z-40 max-w-lg mx-auto px-2.5 sm:px-4 pointer-events-auto transition-all duration-700 animate-in fade-in slide-in-from-bottom-12">
      <div className="glass-panel-gold rounded-t-[28px] sm:rounded-3xl p-4 sm:p-7 max-h-[62vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl border border-white/20 pb-8 sm:pb-7 overscroll-contain">
        {/* Nút thu nhỏ góc trên để ngắm trọn vẹn bông hoa 3D */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-rose-300">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
            <span className="tracking-wide">HAPPY BIRTHDAY</span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
            title="Thu nhỏ để ngắm hoa 3D"
          >
            <span>Ngắm hoa 3D</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lời chúc tiêu đề */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-300 via-rose-200 to-gold-400 bg-clip-text text-transparent font-script tracking-wide mb-1">
            {cardData.title || 'Chúc Mừng Sinh Nhật!'}
          </h2>
          {cardData.subtitle && (
            <p className="text-xs sm:text-sm text-gold-200/80 font-medium">
              {cardData.subtitle}
            </p>
          )}
        </div>

        {/* Album Ảnh kỷ niệm (nếu có) */}
        {images.length > 0 && Boolean(images[currentImgIndex]) && (
          <div className="relative mb-5 group">
            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-midnight-950/80 border border-white/15 shadow-inner">
              <img
                src={images[currentImgIndex]}
                alt="Ảnh kỷ niệm"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80';
                }}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <button
                onClick={() => setIsPhotoLightboxOpen(true)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                title="Phóng to ảnh"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImg}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImg}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Chỉ báo ảnh */}
            {images.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImgIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentImgIndex
                        ? 'w-6 bg-gold-400'
                        : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Khung nội dung lời nhắn */}
        <div className="p-4 sm:p-5 rounded-2xl bg-midnight-950/50 border border-white/10 mb-5">
          <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed whitespace-pre-line font-light">
            {cardData.message || 'Chúc bạn một tuổi mới bình an và hạnh phúc!'}
          </p>
        </div>

        {/* Nút xem lại hoặc tạo thiệp mới */}
        <div className="flex items-center justify-between pt-2">
          {onReplay && (
            <button
              onClick={onReplay}
              className="text-xs text-slate-400 hover:text-gold-300 transition-colors cursor-pointer"
            >
              🔄 Xem lại hoạt ảnh
            </button>
          )}

          {onOpenStudio ? (
            <button
              onClick={onOpenStudio}
              className="text-xs text-rose-300 hover:text-rose-200 hover:underline transition-colors ml-auto cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Sửa / Tự tạo thiệp mới →</span>
            </button>
          ) : (
            <a
              href="./"
              className="text-xs text-rose-300/80 hover:text-rose-200 hover:underline transition-colors ml-auto cursor-pointer"
            >
              Tự tạo thiệp của riêng bạn →
            </a>
          )}
        </div>
      </div>

      {/* Lightbox phóng to ảnh */}
      {isPhotoLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setIsPhotoLightboxOpen(false)}
        >
          <img
            src={images[currentImgIndex]}
            alt="Ảnh kỷ niệm"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80';
            }}
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
          />
        </div>
      )}
    </div>
  );
};
