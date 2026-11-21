import React, { useState, useEffect } from 'react';
import { CardData, ScenePhase } from './types/card';
import { DEFAULT_CARD_DATA } from './constants/presets';
import { getCardDataFromUrl } from './utils/compressor';
import { CardCreator } from './components/creator/CardCreator';
import { InvitationGate } from './components/viewer/InvitationGate';
import { ParticleScene } from './components/viewer/ParticleScene';
import { GreetingCard } from './components/viewer/GreetingCard';
import { MusicPlayer } from './components/viewer/MusicPlayer';

export const App: React.FC = () => {
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isViewerMode, setIsViewerMode] = useState<boolean>(false);
  const [phase, setPhase] = useState<ScenePhase>('gate');
  const [musicStarted, setMusicStarted] = useState<boolean>(false);

  // Kiểm tra URL hash khi load trang
  useEffect(() => {
    const handleCheckUrl = () => {
      const dataFromUrl = getCardDataFromUrl();
      if (dataFromUrl) {
        setCardData(dataFromUrl);
        setIsViewerMode(true);
        setPhase('gate');
      } else {
        setIsViewerMode(false);
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

  // Nếu đang ở Creator Mode (không có dữ liệu trong URL hash)
  if (!isViewerMode) {
    return <CardCreator />;
  }

  // Nếu đang ở Viewer Mode (người nhận quét mã QR hoặc mở link thiệp)
  const activeCard = cardData || DEFAULT_CARD_DATA;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#080510] select-none">
      {/* 1. Màn hình mở đầu (Invitation Gate Screen) */}
      {phase === 'gate' && (
        <InvitationGate
          onOpen={handleOpenGate}
          senderName={activeCard.subtitle}
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
        <GreetingCard cardData={activeCard} onReplay={handleReplay} />
      )}

      {/* 4. Điều khiển Nhạc nền góc màn hình */}
      {musicStarted && (
        <MusicPlayer musicUrl={activeCard.musicUrl} autoPlay={true} />
      )}
    </div>
  );
};

export default App;
