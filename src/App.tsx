import React, { useState, useEffect } from 'react';
import { CardData, ScenePhase } from './types/card';
import { DEFAULT_CARD_DATA } from './constants/presets';
import { getCardDataFromUrl } from './utils/compressor';
import { CardCreator } from './components/creator/CardCreator';
import { InvitationGate } from './components/viewer/InvitationGate';
import { ParticleScene } from './components/viewer/ParticleScene';
import { GreetingCard } from './components/viewer/GreetingCard';
import { MusicPlayer } from './components/viewer/MusicPlayer';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);
  const [phase, setPhase] = useState<ScenePhase>('gate');
  const [musicStarted, setMusicStarted] = useState<boolean>(false);
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);

  // Kiểm tra URL hash khi load trang
  useEffect(() => {
    const handleCheckUrl = () => {
      const dataFromUrl = getCardDataFromUrl();
      if (dataFromUrl) {
        setCardData(dataFromUrl);
      } else {
        setCardData(DEFAULT_CARD_DATA);
      }
    };

    handleCheckUrl();
    window.addEventListener('hashchange', handleCheckUrl);
    return () => window.removeEventListener('hashchange', handleCheckUrl);
  }, []);

  // Người nhận chạm mở cổng Invitation Gate
  const handleOpenGate = () => {
    setMusicStarted(true);
    setPhase('cake');
  };

  // Người nhận chạm vào bánh kem 3D -> Bắt đầu morphing sang hoa
  const handleCakeClick = () => {
    setPhase('morphing');
  };

  // Khi quá trình morphing hoàn tất -> Sang phase hoa nở và hiển thị thiệp
  const handleMorphComplete = () => {
    setPhase('flower');
    setTimeout(() => {
      setPhase('revealed');
    }, 700);
  };

  // Xem lại hoạt ảnh từ đầu
  const handleReplay = () => {
    setPhase('cake');
  };

  // Khi người dùng lưu hoặc áp dụng thiệp mới từ Studio
  const handleApplyNewCard = (newCard: CardData) => {
    setCardData(newCard);
    setPhase('cake');
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#080510] select-none">
      {/* 1. Màn hình mở đầu (Invitation Gate Screen) */}
      {phase === 'gate' && (
        <InvitationGate
          onOpen={handleOpenGate}
          senderName={cardData.subtitle}
        />
      )}

      {/* 2. Đồ họa Three.js 3D Particle Scene (Cake & Blooming Flower) */}
      {phase !== 'gate' && (
        <ParticleScene
          phase={phase}
          onCakeClick={handleCakeClick}
          onMorphComplete={handleMorphComplete}
        />
      )}

      {/* 3. Hiển thị nội dung thiệp Glassmorphism khi hoa đã nở */}
      {(phase === 'flower' || phase === 'revealed') && (
        <GreetingCard
          cardData={cardData}
          onReplay={handleReplay}
          onOpenStudio={() => setIsStudioOpen(true)}
        />
      )}

      {/* 4. Nút mở Studio Tạo / Sửa Thiệp ở góc trên bên trái */}
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsStudioOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full glass-panel text-slate-200 hover:text-gold-300 text-xs font-medium border border-white/15 hover:border-gold-400/40 shadow-lg active:scale-95 transition-all cursor-pointer"
          title="Tạo thiệp mới hoặc chỉnh sửa thiệp"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span className="hidden xs:inline sm:inline">Tạo / Sửa Thiệp</span>
        </button>
      </div>

      {/* 5. Điều khiển Nhạc nền góc trên bên phải */}
      {musicStarted && (
        <MusicPlayer musicUrl={cardData.musicUrl} autoPlay={true} />
      )}

      {/* 6. Studio Modal Popup: Tích hợp đầy đủ trên cùng trang index */}
      <CardCreator
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        initialData={cardData}
        onApplyCard={handleApplyNewCard}
      />
    </div>
  );
};

export default App;
