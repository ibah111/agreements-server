import { Dict } from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { DictInput } from './Dict.input';
@Injectable()
export class DictService {
  constructor(@InjectModel(Dict, 'contact') private ModelDict: typeof Dict) {}
  async dict(body: DictInput) {
    return await this.ModelDict.findAll({
      where: { parent_id: body.id },
    });
  }
}
