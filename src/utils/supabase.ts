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
 * Tải file lên Supabase Storage nếu đã cấu hình key, trả về URL công khai.
 * Nếu không có key, trả về null để client nén Data URL trực tiếp (đảm bảo hiển thị 100% trong thẻ img).
 */
export async function uploadMediaToCloud(
  file: File | Blob,
  folder: 'images' | 'audio',
  fileName = 'upload.jpg'
): Promise<string | null> {
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

  return null;
}
