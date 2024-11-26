import { Injectable } from "@nestjs/common";
import { CreateProductoDto } from "./dto/create-producto.dto";
import { UpdateProductoDto } from "./dto/update-producto.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async create(createProductoDto: CreateProductoDto) {
    //Deconstruimos el objeto
    const { marca, descripcion, precioUnitario, cantStock, activo } =
      createProductoDto || {};

    const newProducto = await this.prisma.producto.create({
      data: { ...createProductoDto },
    });
    //Retornamos el producto creado
    return newProducto;
  }

  findAll() {
    return `This action returns all productos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
