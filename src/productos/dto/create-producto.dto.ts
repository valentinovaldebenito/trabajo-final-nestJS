import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateProductoDto {
  //Usamos las validaciones para controlar
  //que tipos de datos debemos recibir
  @IsString() // Debe ser string
  marca: string;
  descripcion: string;
  @IsNumber()
  precioUnitario: number;
  cantStock: number;
  @IsBoolean()
  activo: boolean;
}
