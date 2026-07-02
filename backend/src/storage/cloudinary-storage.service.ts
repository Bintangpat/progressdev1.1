import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { StorageService } from './storage.service';

@Injectable()
export class CloudinaryStorageService implements StorageService {
  constructor(private configService: ConfigService) {
    const cloudinaryUrl = this.configService.get<string>('CLOUDINARY_URL');
    if (cloudinaryUrl) {
      process.env.CLOUDINARY_URL = cloudinaryUrl;
    }

    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    let cloudName = '';

    if (cloudinaryUrl) {
      // Extract cloud name from URL: cloudinary://key:secret@cloudname
      const parts = cloudinaryUrl.split('@');
      if (parts.length > 1) {
        cloudName = parts[parts.length - 1];
      }
    }

    cloudinary.config({
      cloud_name: cloudName || undefined,
      api_key: apiKey || undefined,
      api_secret: apiSecret || undefined,
      secure: true,
    });
  }

  async uploadScreenshot(file: Express.Multer.File, taskId: string, userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `screenshots/${userId}`,
          public_id: `${taskId}-${Date.now()}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            return reject(new InternalServerErrorException(error.message));
          }
          if (!result) {
            return reject(new InternalServerErrorException('Cloudinary upload failed: no result returned'));
          }
          resolve(result.secure_url);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
