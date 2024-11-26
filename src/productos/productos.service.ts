/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductoDto } from "./dto/create-producto.dto";
import { UpdateProductoDto } from "./dto/update-producto.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { PaginatorDto } from "src/usuarios/dto/paginator.dto";
import { CreateEdicionesDto } from "src/ediciones/dto/create-edicione.dto";
import { UpdateUsuarioDto } from "src/usuarios/dto/update-usuario.dto";
import { Usuario } from "@prisma/client";

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async create(createProductoDto: CreateProductoDto) {
    //Deconstruimos el objeto
    const { marca, descripcion, precioUnitario, cantStock, activo } =
      createProductoDto || {};

    if (!marca || !descripcion || !precioUnitario || !cantStock || !activo)
      throw new BadRequestException(
        "Error al cargar producto, faltan campos por completar",
      );

    const newProducto = await this.prisma.producto.create({
      data: { ...createProductoDto },
    });
    //Retornamos el producto creado
    return newProducto;
  }

  // Para obtener todos los productos utilizando el paginador
  async findAll(paginator: PaginatorDto) {
    //Desestructuramos el objeto
    const { page, perPage } = paginator || {};
    //Creamos una variables let que si no tiene datos
    //devolvera undefined
    let metadata;
    const totalPages = await this.prisma.producto.count({
      //Filtrando solo los disponibles
      where: { activo: true },
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
    const data = await this.prisma.producto.findMany({
      //En caso de que existan estos datos, trae todo directamente
      skip: page ? (page - 1) * perPage : undefined,
      take: perPage ? perPage : undefined,
      //Filtramos por disponible
      where: { activo: true },
    });
    //Y retornamos la informacion
    return {
      data,
      //Los metadatos dependen de la informacion
      //provista por el paginador
      metadata: metadata ? metadata : { totalRecords: totalPages },
    };
  }

  // Para buscar un producto en particular
  async findOne(id: number) {
    const producto = await this.prisma.producto.findFirst({ where: { id, activo: true } });
    if (!producto) throw new NotFoundException("Producto no encontrado");
    return producto;
  }

  // Para editar un producto
  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
    usuario: UpdateUsuarioDto,
  ) {
    // Desestructuramos el objeto y limpiamos el valor del ID
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: __, ...data } = updateProductoDto;
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

  // Para desactivar un producto
  async remove(id: number, usuario: UpdateUsuarioDto) {
    const edicion: CreateEdicionesDto = {
      descripcion: "Eliminado",
      usuarioEditorId: usuario.id,
    };
    const result = await this.prisma.producto.update({
      where: { id },
      data: {
        // Cambiamos su disponibilidad
        activo: false,
        ediciones: {
          // Insertamos la edición en cascada
          create: edicion,
        },
      },
    });
    return result;
  }
}
