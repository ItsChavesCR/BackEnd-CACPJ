import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLoginDto {
  @IsString()
  @IsNotEmpty()
  readonly area: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
