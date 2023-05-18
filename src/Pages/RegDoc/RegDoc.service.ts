import { Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { RegDocType } from 'src/Modules/Database/Local.Database/models/RegDocType';

@Injectable()
export default class RegDocService {
  constructor(
    @InjectModel(RegDocType, 'local')
    private readonly modelRegDoc: typeof RegDocType,
  ) {}
  async getAll() {
    return await this.modelRegDoc.findAll({ attributes: ['id', 'title'] });
  }
}
