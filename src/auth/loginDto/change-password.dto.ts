// change-password.dto.ts
import { IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  @Matches(/[A-Z]/, { message: 'Contraseña incorrecta, intente de nuevo' })
  @Matches(/[a-z]/, { message: 'Contraseña incorrecta, intente de nuevo' })
  @Matches(/[0-9]/, { message: 'Contraseña incorrecta, intente de nuevo' })
  newPassword: string;
}
