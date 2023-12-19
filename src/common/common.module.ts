import { Global, Module } from '@nestjs/common';
import { EmailService, PDFService, CloudinaryService } from './services';

@Global()
@Module({
  exports: [PDFService, EmailService, CloudinaryService],
  providers: [PDFService, EmailService, CloudinaryService],
})
export class CommonModule {}
