import { SetMetadata } from "@nestjs/common";
import { IS_PUBLIC_KEY } from "../keys/public.key";

//Este decorador solo agrega metadatos a las rutas
//Pasa la llave pública que podríamos usar un string plano,
//pero es de buenas prácticas usar constantes
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);