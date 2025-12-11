import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  postMessage(): string {
    return 'Mensaje enviado correctamente...';
  }
  putMessage(): string {
    return 'Mensaje editado correctamente...';
  }
}
