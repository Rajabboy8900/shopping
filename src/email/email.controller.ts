import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('api/mailer')
export class MailerController {
  constructor(private readonly mailerService: EmailService) {}
}
