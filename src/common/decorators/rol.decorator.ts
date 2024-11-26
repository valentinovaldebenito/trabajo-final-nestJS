import { SetMetadata } from "@nestjs/common";
import { RolesKey } from "../keys/rol.key";

export const Roles = (...roles: string[]) => SetMetadata(RolesKey, roles)