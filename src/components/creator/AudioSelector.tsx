import React, { useState, useRef } from 'react';
import { MUSIC_PRESETS } from '../../constants/presets';
import { MusicPreset } from '../../types/card';
import { Play, Pause, Upload, Link as LinkIcon, Music, Check } from 'lucide-react';
import { uploadMediaToCloud } from '../../utils/supabase';

interface AudioSelectorProps {
  selectedPresetId?: string;
  customMusicUrl?: string;
  onSelect: (presetId: string, url: string) => void;
}

export const AudioSelector: React.FC<AudioSelectorProps> = ({
  selectedPresetId,
  customMusicUrl,
  onSelect,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'upload' | 'url'>('preset');
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(customMusicUrl || '');
  const [uploading, setUploading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePreview = (preset: MusicPreset) => {
    if (previewingId === preset.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPreviewingId(null);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = preset.url;
      audioRef.current.play().catch(console.warn);
      setPreviewingId(preset.id);

      audioRef.current.onended = () => setPreviewingId(null);
    }
  };

  const handleSelectPreset = (preset: MusicPreset) => {
    onSelect(preset.id, preset.url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Thử tải lên Supabase Storage nếu có cấu hình
      const cloudUrl = await uploadMediaToCloud(file, 'audio', file.name);

      if (cloudUrl) {
        onSelect('custom', cloudUrl);
      } else {
        // Fallback: Chuyển sang Data URL hoặc Object URL
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          onSelect('custom', dataUrl);
        };
        reader.readAsDataURL(file);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onSelect('custom', urlInput.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex p-1 rounded-xl bg-midnight-950/60 border border-white/10 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('preset')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
            activeTab === 'preset'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Nhạc Mẫu Có Sẵn
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
            activeTab === 'upload'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Tải File MP3
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
            activeTab === 'url'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Dán Link Audio
        </button>
      </div>

      {/* Tab 1: Presets */}
      {activeTab === 'preset' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {MUSIC_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            const isPlaying = previewingId === preset.id;

            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`relative p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-midnight-700/80 border-gold-400 shadow-md shadow-gold-500/10'
                    : 'bg-midnight-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Music className={`w-3.5 h-3.5 ${isSelected ? 'text-gold-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-white line-clamp-1">
                      {preset.name}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-gold-400" />}
                </div>

                <p className="text-[11px] text-slate-400 mb-2">{preset.genre}</p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePreview(preset);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-slate-200 transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 text-gold-400" />
                      <span>Dừng</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-gold-400" />
                      <span>Nghe thử</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Upload MP3 */}
      {activeTab === 'upload' && (
        <div className="p-4 rounded-xl border border-dashed border-white/20 bg-midnight-900/40 text-center">
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <Upload className="w-7 h-7 text-rose-400 mb-2" />
            <span className="text-xs font-medium text-slate-200 mb-1">
              {uploading ? 'Đang xử lý tải lên...' : 'Chọn file MP3 / WAV từ thiết bị của bạn'}
            </span>
            <span className="text-[11px] text-slate-400 font-light">
              Hỗ trợ định dạng .mp3, .wav, .ogg
            </span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
      )}

      {/* Tab 3: URL Direct */}
      {activeTab === 'url' && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="url"
              placeholder="https://example.com/audio.mp3"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 text-xs font-medium transition-colors"
          >
            Áp dụng
          </button>
        </div>
      )}
    </div>
  );
};
