import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PDFService {
  async createPDF(htmlContent, pdfOptions) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const buffer = await page.pdf(pdfOptions);
    await browser.close();

    // Generate a unique file name using uuidv4
    const fileName = `${uuidv4()}.pdf`;

    // Create a simulated file object
    const file = {
      fieldname: 'pdf',
      originalname: fileName,
      mimetype: 'application/pdf',
      buffer: buffer,
      size: buffer.length,
    };

    return file;
  }
}
