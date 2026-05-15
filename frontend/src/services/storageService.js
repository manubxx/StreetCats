import { supabase } from './supabaseClient';

export const storageService = {
  async uploadCatImage(file, userId) {
    if (!file) return '';

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('catpictures')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('catpictures')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }
};