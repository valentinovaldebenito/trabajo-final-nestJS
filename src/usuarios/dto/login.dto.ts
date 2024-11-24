import { IsEmail, IsString } from "class-validator";
//Con esta clase controlamos el objeto
// obtenido al hacer Login

export class LoginDto {
  @IsEmail()
  correo: string;
  @IsString()
  contrasenia: string;
}
