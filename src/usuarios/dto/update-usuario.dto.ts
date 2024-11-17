import { PartialType } from "@nestjs/mapped-types";
import { CreateUsuarioDto } from "./create-usuario.dto";
import { IsNumber, IsPositive } from "class-validator";
import { Type } from "class-transformer";

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsNumber() // Tiene que ser numero
  @IsPositive() //Tiene que ser positivo
  //Transformamos si tipo a Number
  @Type(() => Number)
  id: number;
}
