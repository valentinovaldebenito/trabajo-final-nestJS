import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadInterface } from "src/common/PayloadInterface";
import { envs } from "src/configuration";
import { UsuariosService } from "../usuarios.service";

@Injectable()
export class JwtPassport extends PassportStrategy(Strategy) {
  constructor(private readonly usuarioService: UsuariosService) {
    super({
      //Extraemos el token del header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //Tenemos en cuenta la expiración
      ignoreExpiration: false,
      //Pasamos la firma para validarlo
      secretOrKey: envs.jwt_seed,
    });
  }

  async validate(payload: PayloadInterface) {
    try {
      //Retornamos el usuario del payload en la request
      return await this.usuarioService.findOne(+payload.sub);
    } catch (err) {
      throw new UnauthorizedException("User not found on token" + err);
    }
  }
}
