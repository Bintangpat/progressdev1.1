import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class UsersMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}
