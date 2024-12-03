import { Rol } from "@prisma/client";
import { IsEmail, IsIn, IsString } from "class-validator";

export class CreateUsuarioDto {
  //Usamos las validaciones para controlar
  //que tipos de datos debemos recibir
  @IsEmail() //Debe ser email
  correo: string;
  @IsString() //Debe ser string
  contrasenia: string;
  @IsString()
  @IsIn(["COMUN", "ADMIN"], {
    message: "Los roles permitidos son COMUN o ADMIN",
  })
  rol?: Rol;
}
