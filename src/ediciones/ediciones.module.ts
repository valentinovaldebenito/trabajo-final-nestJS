import { Module } from '@nestjs/common';
import { EdicionesService } from './ediciones.service';
import { EdicionesController } from './ediciones.controller';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/usuarios/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [EdicionesController],
  providers: [EdicionesService, UsuariosService, PrismaService, AuthService, JwtService],
})
export class EdicionesModule {}
