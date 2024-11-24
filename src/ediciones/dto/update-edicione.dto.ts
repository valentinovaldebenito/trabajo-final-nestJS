import { PartialType } from '@nestjs/mapped-types';
import { CreateEdicioneDto } from './create-edicione.dto';

export class UpdateEdicioneDto extends PartialType(CreateEdicioneDto) {}
