import { PartialType } from '@nestjs/mapped-types';
import { CreateEdicionesDto } from './create-edicione.dto';

export class UpdateEdicionesDto extends PartialType(CreateEdicionesDto) {}
