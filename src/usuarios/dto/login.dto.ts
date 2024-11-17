//Con esta clase controlamos el objeto

import { IsEmail, IsString } from "class-validator";

// obtenido al hacer Login
export class LoginDto {
  @IsEmail()
  correo: string;
  @IsString()
  contrasenia: string;
}
