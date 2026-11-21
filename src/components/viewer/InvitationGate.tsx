import React from 'react';
import { Gift, Sparkles, Heart } from 'lucide-react';

interface InvitationGateProps {
  onOpen: () => void;
  senderName?: string;
}

export const InvitationGate: React.FC<InvitationGateProps> = ({ onOpen, senderName }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#080510]/95 backdrop-blur-xl transition-all duration-1000">
      {/* Vòng sáng hào quang nền */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-rose-600/20 to-gold-400/20 blur-3xl -z-10 animate-pulse-slow" />

      <div className="flex flex-col items-center max-w-sm text-center">
        {/* Biểu tượng Hộp quà sinh nhật lấp lánh */}
        <div className="relative mb-8 group cursor-pointer" onClick={onOpen}>
          <div className="absolute -inset-4 bg-gradient-to-r from-rose-500 to-gold-400 rounded-3xl opacity-30 group-hover:opacity-75 blur-xl transition duration-500" />
          <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-midnight-800/90 border border-white/15 shadow-2xl group-hover:scale-105 transition-all duration-300">
            <Gift className="w-12 h-12 text-gold-300 group-hover:text-gold-400 transition-colors" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-rose-300 animate-spin-slow" />
          </div>
        </div>

        {/* Tiêu đề mời gọi */}
        <span className="text-xs uppercase tracking-widest text-gold-400/90 font-medium mb-2 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
          Món Quà Sinh Nhật Dành Riêng Cho Bạn
        </span>

        <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
          Có một bất ngờ đang chờ bạn
        </h1>

        <p className="text-sm text-slate-300/80 mb-8 leading-relaxed font-light">
          {senderName 
            ? `Một tấm thiệp chúc mừng sinh nhật ấm áp từ ${senderName} đã được gửi đến.`
            : 'Hãy chạm vào bên dưới để bắt đầu giai điệu sinh nhật và mở bức thiệp chúc mừng ý nghĩa.'}
        </p>

        {/* Nút bấm tinh tế chạm mở quà */}
        <button
          onClick={onOpen}
          className="relative inline-flex items-center justify-center gap-3 px-8 py-3.5 text-sm sm:text-base font-medium text-slate-900 rounded-full bg-gradient-to-r from-gold-300 via-rose-300 to-gold-400 hover:from-gold-400 hover:to-rose-400 shadow-lg shadow-gold-500/25 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-slate-900" />
          <span>Chạm để mở quà</span>
        </button>

        <span className="text-[11px] text-slate-400/60 mt-4 font-light">
          * Đeo tai nghe hoặc bật âm lượng để tận hưởng trọn vẹn âm nhạc
        </span>
      </div>
    </div>
  );
};
