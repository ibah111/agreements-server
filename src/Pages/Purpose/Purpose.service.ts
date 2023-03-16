import { Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { PurposeType } from 'src/Modules/Database/Local.Database/models/PurposeType';

@Injectable()
export default class PurposeService {
  constructor(
    @InjectModel(PurposeType, 'local')
    private readonly modelPurpose: typeof PurposeType,
  ) {}
  async getAll() {
    return await this.modelPurpose.findAll({ attributes: ['id', 'title'] });
  }
}
