import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private createTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async sendOtpCode(to: string, code: string): Promise<void> {
    const emailData = {
      from: `"Do'kon Support" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Tasdiqlash kodi',
      text: `Sizning tasdiqlash kodingiz: ${code}`,
      html: `<p>Sizning <b>tasdiqlash kodingiz</b>: <strong>${code}</strong></p>`,
    };

    try {
      await this.createTransport().sendMail(emailData);
    } catch (error) {
      throw new InternalServerErrorException('Kod yuborishda xatolik yuz berdi');
    }
  }
}
