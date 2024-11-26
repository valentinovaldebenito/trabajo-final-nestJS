import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesKey } from "src/common/keys/rol.key";

@Injectable()
export class RolGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(
      RolesKey,
      [context.getHandler(), context.getClass()],
    );
    if (!rolesRequeridos) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const tieneRol = rolesRequeridos.some((rol) => user.rol?.includes(rol));

    if (!tieneRol) {
      throw new ForbiddenException("No posée los permisos necesarios!");
    }
    return tieneRol;
  }
}
