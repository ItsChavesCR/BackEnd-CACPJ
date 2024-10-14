import { IsString } from 'class-validator';

export class ValidateCodeDto {
  @IsString()
  code: string;
}
