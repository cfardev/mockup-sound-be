import { Global, Module } from '@nestjs/common';
import { EmailService, PDFService, S3Service } from './services';

@Global()
@Module({
  exports: [PDFService, EmailService, S3Service],
  providers: [PDFService, EmailService, S3Service],
})
export class CommonModule {}
