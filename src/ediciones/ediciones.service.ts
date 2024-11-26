import { Injectable } from '@nestjs/common';
import { CreateEdicionesDto } from './dto/create-edicione.dto';
import { UpdateEdicionesDto } from './dto/update-edicione.dto';

@Injectable()
export class EdicionesService {
  create(createEdicionesDto: CreateEdicionesDto) {
    return 'This action adds a new edicione';
  }

  findAll() {
    return `This action returns all ediciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} edicione`;
  }

  update(id: number, updateEdicionesDto: UpdateEdicionesDto) {
    return `This action updates a #${id} edicione`;
  }

  remove(id: number) {
    return `This action removes a #${id} edicione`;
  }
}
