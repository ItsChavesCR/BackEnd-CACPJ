/* eslint-disable prettier/prettier */

import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  area: string;

  @IsString()
  password: string;
}


