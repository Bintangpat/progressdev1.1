export abstract class StorageService {
  abstract uploadScreenshot(
    file: Express.Multer.File,
    taskId: string,
    userId: string,
  ): Promise<string>;
}
