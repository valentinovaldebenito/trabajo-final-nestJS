import { Controller } from "@nestjs/common";
import { EdicionesService } from "./ediciones.service";
import { UsuariosService } from "src/usuarios/usuarios.service";

@Controller("ediciones")
export class EdicionesController {
  constructor(
    private readonly edicionesService: EdicionesService,
    private usuariosService: UsuariosService,
  ) {}
}
