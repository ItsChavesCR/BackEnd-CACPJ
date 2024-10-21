// change-password-recovery.dto.ts
import { IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordRecoveryDto {
  @IsString()
  recoveryCode: string;

  @IsString()
  area: string;

  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  @Matches(/[A-Z]/, { message: 'Debe tener al menos una letra mayúscula' })
  @Matches(/[a-z]/, { message: 'Debe tener al menos una letra minúscula' })
  @Matches(/[0-9]/, { message: 'Debe tener al menos un número' })
  newPassword: string;
}
