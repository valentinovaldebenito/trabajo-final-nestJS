import { IsEmail, IsString } from "class-validator";

export class CreateUsuarioDto {
  //Usamos las validaciones para controlar
  //que tipos de datos debemos recibir
  @IsEmail()//Debe ser email
  correo: string;
  @IsString()//Debe ser string
  contrasenia: string;
}