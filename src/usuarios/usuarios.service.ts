/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "./auth/auth.service";
import { LoginDto } from "./dto/login.dto";
import { PaginatorDto } from "./dto/paginator.dto";
import { CreateEdicionesDto } from "src/ediciones/dto/create-edicione.dto";

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  //! Servicios de autenticación -------------------->
  async register(createUsuarioDto: CreateUsuarioDto) {
    //Deconstruimos el objeto
    const { contrasenia, correo } = createUsuarioDto || {};
    //Buscamos en los registros si ya hay un usuario con ese correo
    const usuario = await this.prisma.usuario.findFirst({ where: { correo } });
    //Si existe, lanzamos el error
    if (usuario) throw new BadRequestException("Correo already taken");
    //En caso que no se encuentre la contraseña (no debería pasar si se configuro bien el DTO)
    if (!contrasenia) throw new BadRequestException("Some params are required");
    //Hasheamos la contraseña
    const hashPassword = await this.auth.hashContrasenia(contrasenia);
    //Creamos el usuario
    const newUsuario = await this.prisma.usuario.create({
      data: { ...createUsuarioDto, contrasenia: hashPassword },
    });
    //Borramos la propiedad de la contraseña
    delete newUsuario["contrasenia"];
    //Retornamos el usuario creado
    return newUsuario;
  }

  /**
   *
   * @description
   * Realiza el login del usuario, y devuelve el token
   * @param credenciales Credenciales del usuario {correo, contrasenia}
   * @returns {token, usuario}
   */
  async login(credenciales: LoginDto) {
    //Desestructuramos el objeto
    const { correo, contrasenia } = credenciales || {};
    //Buscamos el usuario en la base de datos
    const usuario = await this.prisma.usuario.findFirst({ where: { correo } });
    //!Si no existe, no autorizado
    if (!usuario) throw new UnauthorizedException("User not found");
    //Comparamos la contraseña
    const isPassword = await this.auth.compararContrasenia(
      contrasenia,
      usuario.contrasenia,
    );
    //!Si no coinciden, no autorizado
    if (!isPassword) throw new UnauthorizedException("Wrong credentials");
    //Creamos el token
    const token = this.auth.crearJwt(usuario);
    //Eliminamos la contraseña del objeto
    delete usuario["contrasenia"];
    //Retornamos el token y el usuario
    return { token, usuario };
  }
  //!Servicios de autenticación ---------------------------------------->

  async create(createUsuarioDto: CreateUsuarioDto) {
    //Deconstruimos el objeto
    const { contrasenia, correo, rol } = createUsuarioDto || {};
    //Buscamos en los registros si ya hay un usuario con ese correo
    const usuario = await this.prisma.usuario.findFirst({ where: { correo } });
    //Si existe, lanzamos el error
    if (usuario) throw new BadRequestException("El correo ingresado ya existe");
    //En caso que no se encuentre la contraseña (no debería pasar si se configuro bien el DTO)
    if (!contrasenia) throw new BadRequestException("Ingrese todos los campos");
    //Hasheamos la contraseña
    const hashPassword = await this.auth.hashContrasenia(contrasenia);
    //Creamos el usuario
    const newUsuario = await this.prisma.usuario.create({
      data: { ...createUsuarioDto, contrasenia: hashPassword },
    });
    //Borramos la propiedad de la contraseña
    delete newUsuario["contrasenia"];
    //Retornamos el usuario creado
    return newUsuario;
  }

  async findAll(paginator: PaginatorDto) {
    //Desestructuramos el objeto
    const { page, perPage } = paginator || {};
    //Creamos una variables let que si no tiene datos
    //devolvera undefined
    let metadata;
    const totalPages = await this.prisma.usuario.count({
      //Filtrando solo los disponibles
      where: { disponible: true },
    });
    //Dividimos por la cantidad por pagina
    const lastPage = Math.ceil(totalPages / perPage);
    //Y si existen la pagina y cantidad por pagina
    //devolvemos los metadatos
    if (page && perPage)
      metadata = {
        page, //El numero de pagina
        totalPages, //Total de paginas
        lastPage, //Cual seria la ultima pagina
      };

    //Buscamos los datos
    const data = await this.prisma.usuario.findMany({
      //En caso de que existan estos datos, trae todo directamente
      skip: page ? (page - 1) * perPage : undefined,
      take: perPage ? perPage : undefined,
      //Filtramos por disponible
      where: { disponible: true },
    });
    //Y retornamos la informacion
    return {
      data,
      //Los metadatos dependen de la informacion
      //provista por el paginador
      metadata: metadata ? metadata : { totalRecords: totalPages },
    };
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findFirst({ where: { id, disponible: true } });
    if (!usuario) throw new NotFoundException("User not found");
    return usuario;
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
    usuario: UpdateUsuarioDto,
  ) {
    // Desestructuramos el objeto y limpiamos el valor del ID
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: __, ...data } = updateUsuarioDto;
    // Creamos el objeto "edicion", en el ID del usuario
    // editor (usuario logueado)
    const edicion: CreateEdicionesDto = {
      descripcion: "Editado",
      usuarioEditorId: usuario.id,
    };
    // Insertamos los valores en la base de datos
    const result = await this.prisma.usuario.update({
      where: { id },
      data: {
        ...data,
        ediciones: {
          /**-----------------------------------------------> 
           * Indicamos que cree el objeto edicion en cascada. El
           * ID del registro editado se inserta automáticamente
           * mediante esta relación. El ID del usuario editor lo
           * agregamos nosotros en el paso anterior
          <--------------------------------------------------**/
          create: edicion,
        },
      },
    });

    delete result["contrasenia"];
    return result;
  }

  async remove(id: number, usuario: UpdateUsuarioDto) {
    const edicion: CreateEdicionesDto = {
      descripcion: "Eliminado",
      usuarioEditorId: usuario.id,
    };
    const result = await this.prisma.usuario.update({
      where: { id },
      data: {
        // Cambiamos su disponibilidad
        disponible: false,
        ediciones: {
          // Insertamos la edición en cascada
          create: edicion,
        },
      },
    });
    delete result["contrasenia"];
    return result;
  }
}
