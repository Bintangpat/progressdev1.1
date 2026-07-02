import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { CloudinaryStorageService } from './cloudinary-storage.service';

@Global()
@Module({
  providers: [
    {
      provide: StorageService,
      useClass: CloudinaryStorageService,
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
