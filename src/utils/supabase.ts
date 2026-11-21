import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const bucketName = import.meta.env.VITE_SUPABASE_BUCKET || 'birthday-cards';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Tải file lên Cloud Storage miễn phí, trả về URL công khai ngắn gọn
 * Ưu tiên Supabase nếu có cấu hình; nếu không, tự động dùng Free Cloud API với CORS toàn cầu
 */
export async function uploadMediaToCloud(
  file: File | Blob,
  folder: 'images' | 'audio',
  fileName = 'upload.jpg'
): Promise<string | null> {
  // 1. Ưu tiên Supabase nếu người dùng đã cấu hình
  if (supabase && isSupabaseConfigured) {
    try {
      const ext = fileName ? fileName.split('.').pop() : 'bin';
      const uniquePath = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(uniquePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (!uploadError) {
        const { data } = supabase.storage.from(bucketName).getPublicUrl(uniquePath);
        return data.publicUrl;
      }
    } catch (err) {
      console.warn('Supabase upload warning:', err);
    }
  }

  // 2. Tự động lưu trữ qua Free Cloud API (CORS mở, link ảnh trực tiếp để render thẻ img)
  try {
    const formData = new FormData();
    formData.append('file', file, fileName);

    const response = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      if (result && result.status === 'success' && result.data?.url) {
        // Chuyển sang link direct download (tmpfiles.org/dl/...) để tải ảnh trực tiếp
        const directUrl = result.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        return directUrl;
      }
    }
  } catch (cloudErr) {
    console.warn('Free Cloud Upload error, falling back to micro-compress:', cloudErr);
  }

  return null;
}
