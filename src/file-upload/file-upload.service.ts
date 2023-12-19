import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../common/services';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly cloudinary: CloudinaryService,
    private readonly prisma: PrismaService,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<{
    url: string;
  }> {
    const fileUploadedUrl = await this.cloudinary.upload(file);

    return {
      url: fileUploadedUrl.secure_url,
    };
  }

  async deleteFile(url: string) {
    await this.prisma.$transaction([]);
  }
}
