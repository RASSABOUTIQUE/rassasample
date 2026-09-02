import { supabase } from "@/lib/supabase";

export interface IStorageService {
  uploadImage(file: File, path: string): Promise<string>;
  deleteImage(path: string): Promise<void>;
}

export class SupabaseStorageService implements IStorageService {
  private readonly BUCKET_NAME = "rassa-assets";

  async uploadImage(file: File, path: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw new Error(`Storage upload failed: ${error.message}`);

    const { data: publicUrlData } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  }

  async deleteImage(path: string): Promise<void> {
    // Extract the relative path from a full public URL if necessary
    let relativePath = path;
    const urlMarker = `/storage/v1/object/public/${this.BUCKET_NAME}/`;
    if (path.includes(urlMarker)) {
      relativePath = path.split(urlMarker)[1];
    }

    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([relativePath]);

    if (error) throw new Error(`Storage deletion failed: ${error.message}`);
  }
}

export const storageService = new SupabaseStorageService();
