import { IsString, IsIn } from 'class-validator';

export class SendRecoveryCodeDto {
  @IsString()
  emailOrPhone: string;

  @IsIn(['email', 'sms'])
  method: 'email' | 'sms';
}
