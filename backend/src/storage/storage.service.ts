import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }

  async uploadScreenshot(file: Express.Multer.File, taskId: string, userId: string): Promise<string> {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${userId}/${taskId}-${Date.now()}.${fileExt}`;

    const { error } = await this.supabase.storage
      .from('screenshots')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from('screenshots')
      .getPublicUrl(fileName);

    return publicUrl;
  }
}
