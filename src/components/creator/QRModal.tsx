import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Check, ExternalLink, X, QrCode, AlertCircle } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

class QRErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: unknown) {
    console.warn('QR code safe fallback triggered:', err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-xl bg-midnight-950 text-xs text-rose-300 border border-rose-400/30 max-w-[260px] mx-auto">
          <AlertCircle className="w-6 h-6 text-rose-400 mx-auto mb-1.5" />
          <p className="font-semibold mb-1">Dữ liệu lớn vượt chuẩn QR</p>
          <p className="text-[11px] text-slate-300">
            Hãy dùng nút <strong>"Sao chép liên kết"</strong> bên dưới để gửi trực tiếp cho bạn bè!
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, shareUrl }) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isUrlTooLongForQR = shareUrl.length > 2200;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `Thiep_Sinh_Nhat_QR_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel-gold rounded-3xl p-6 sm:p-8 text-center border border-white/20 shadow-2xl">
        {/* Nút đóng modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề */}
        <div className="flex items-center justify-center gap-2 mb-2 text-gold-400">
          <QrCode className="w-5 h-5" />
          <span className="text-xs uppercase tracking-wider font-semibold">
            Mã QR Thiệp Sinh Nhật
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Tấm Thiệp Đã Sẵn Sàng!
        </h3>

        <p className="text-xs text-slate-300/80 mb-6 font-light">
          {isUrlTooLongForQR
            ? 'Ảnh của bạn đã được đóng gói an toàn vào liên kết chia sẻ bên dưới!'
            : 'Hãy quét mã QR dưới đây bằng camera điện thoại để trải nghiệm bánh kem hạt 3D và lời chúc ấm áp.'}
        </p>

        {/* Khung chứa Mã QR Code sắc nét (có ErrorBoundary bảo vệ) */}
        <div
          ref={qrRef}
          className="inline-block p-4 rounded-2xl bg-white shadow-2xl mb-6 mx-auto"
        >
          <QRErrorBoundary>
            {isUrlTooLongForQR ? (
              <div className="w-[200px] h-[200px] flex flex-col items-center justify-center text-slate-800 p-3 text-center">
                <QrCode className="w-12 h-12 text-rose-500 mb-2 opacity-80" />
                <span className="text-xs font-semibold text-slate-900 mb-1">
                  Đã tạo liên kết thành công!
                </span>
                <span className="text-[10px] text-slate-600 leading-tight">
                  Nhấn nút Sao chép liên kết bên dưới để gửi trọn vẹn cả ảnh chất lượng cao.
                </span>
              </div>
            ) : (
              <QRCodeCanvas
                value={shareUrl}
                size={220}
                level="M"
                includeMargin={true}
                imageSettings={{
                  src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎂</text></svg>",
                  height: 38,
                  width: 38,
                  excavate: true,
                }}
              />
            )}
          </QRErrorBoundary>
        </div>

        {/* Các nút hành động */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {!isUrlTooLongForQR && (
              <button
                onClick={handleDownloadQR}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gold-400 hover:bg-gold-500 text-slate-950 font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải mã QR (PNG)</span>
              </button>
            )}

            <button
              onClick={handleCopyLink}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl ${
                isUrlTooLongForQR ? 'bg-gold-400 hover:bg-gold-500 text-slate-950 font-bold' : 'bg-midnight-700 hover:bg-midnight-600 text-white'
              } border border-white/15 font-medium text-xs sm:text-sm transition-all active:scale-95 cursor-pointer`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className={isUrlTooLongForQR ? 'text-slate-950' : 'text-green-300'}>
                    Đã sao chép!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép liên kết thiệp</span>
                </>
              )}
            </button>
          </div>

          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-rose-300 hover:text-rose-200 text-xs font-medium hover:bg-white/5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mở thử trang nhận thiệp trên tab mới</span>
          </a>
        </div>
      </div>
    </div>
  );
};
