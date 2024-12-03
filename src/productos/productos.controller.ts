import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Res,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { ProductosService } from "./productos.service";
import { CreateProductoDto } from "./dto/create-producto.dto";
import { UpdateProductoDto } from "./dto/update-producto.dto";
import { PaginatorDto } from "src/usuarios/dto/paginator.dto";
import { Usuario } from "src/common/decorators/usuario.decorator";
import { UpdateEdicionesDto } from "src/ediciones/dto/update-edicione.dto";
import { UpdateUsuarioDto } from "src/usuarios/dto/update-usuario.dto";
import { Response } from "express";
import { JwtGuard } from "src/usuarios/auth/jwt.guard";
import { RolGuard } from "src/usuarios/auth/rol.guard";
import { Rol } from "@prisma/client";
import { Roles } from "src/common/decorators/rol.decorator";

@UseGuards(JwtGuard, RolGuard)
@Controller("productos")
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post("create/product")
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll(@Query() paginator: PaginatorDto) {
    return this.productosService.findAll(paginator);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productosService.findOne(+id);
  }

  @Patch(":id")
  @Roles(Rol.SUPERADMIN, Rol.ADMIN)
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateEdicioneDto: UpdateEdicionesDto,
    @Body() updateProductoDto: UpdateProductoDto,
    @Usuario() usuario: UpdateUsuarioDto,
    @Res() response: Response,
  ) {
    const result = await this.productosService.update(
      id,
      updateProductoDto,
      usuario,
    );

    response.status(HttpStatus.OK).json({ok: true, result, msg: 'Producto editado correctamente'})
  }

  @Delete(":id")
  @Roles(Rol.SUPERADMIN, Rol.ADMIN)
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @Usuario() usuario: UpdateUsuarioDto,
    @Res() response: Response,
  ) {
    const result = await this.productosService.remove(id, usuario);
    response.status(HttpStatus.OK).json({ ok: true, result, msg: "Producto desactivado correctamente" });
  }
}
