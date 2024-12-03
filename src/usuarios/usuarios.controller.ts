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
import { UsuariosService } from "./usuarios.service";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";
import { LoginDto } from "./dto/login.dto";
import { PaginatorDto } from "./dto/paginator.dto";
import { Public } from "src/common/decorators/public.decorator";
import { Usuario } from "src/common/decorators/usuario.decorator";
import { UpdateEdicionesDto } from "src/ediciones/dto/update-edicione.dto";
import { Response } from "express";
import { JwtGuard } from "./auth/jwt.guard";
import { RolGuard } from "./auth/rol.guard";
import { Roles } from "src/common/decorators/rol.decorator";
import { Rol } from "@prisma/client";

@UseGuards(JwtGuard, RolGuard)
@Controller("usuarios")
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post("auth/register")
  @Public() //Hacemos publica esta ruta
  register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.register(createUsuarioDto);
  }
  
  @Post()
  @Roles(Rol.SUPERADMIN)
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Res() response: Response
  ){
    const result = await this.usuariosService.create(createUsuarioDto)
    response.status(HttpStatus.OK).json({ok: true, result, msg: 'Usuario creado exitosamente' })
  }

  @Post("auth/login")
  @Public() //Hacemos publica esta ruta
  login(@Body() credenciales: LoginDto) {
    return this.usuariosService.login(credenciales);
  }

  @Get()
  async findAll(@Query() paginator: PaginatorDto) {
    return this.usuariosService.findAll(paginator);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateEdicioneDto: UpdateEdicionesDto,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Usuario() usuario: UpdateUsuarioDto,
    @Res() response: Response,
  ) {
    const result = await this.usuariosService.update(
      id,
      updateUsuarioDto,
      usuario,
    );
    response.status(HttpStatus.OK).json({ ok: true, result, msg: "Approved" });
  }

  @Delete(":id")
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @Usuario() usuario: UpdateUsuarioDto,
    @Res() response: Response,
  ) {
    const result = await this.usuariosService.remove(id, usuario);
    response.status(HttpStatus.OK).json({ ok: true, result, msg: "Approved" });
  }
}
