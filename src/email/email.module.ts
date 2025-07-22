import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerController } from './email.controller';

@Module({
  controllers: [MailerController],
  providers: [EmailService],
    exports: [EmailService], 
})
export class EmailModule {}
