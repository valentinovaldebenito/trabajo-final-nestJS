import { PartialType } from "@nestjs/mapped-types";
import { IsNumber, IsPositive } from "class-validator";
import { Type } from "class-transformer";
import { CreateProductoDto } from "./create-producto.dto";

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  @IsNumber() // Tiene que ser numero
  @IsPositive() //Tiene que ser positivo
  //Transformamos si tipo a Number
  @Type(() => Number)
  id: number;
}
