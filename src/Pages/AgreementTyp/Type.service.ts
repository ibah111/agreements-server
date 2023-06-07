import { Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { TypeAgreement } from 'src/Modules/Database/Local.Database/models/AgreementType';

@Injectable()
export default class TypeService {
  constructor(
    @InjectModel(TypeAgreement, 'local')
    private readonly modelTypeAgreement: typeof TypeAgreement,
  ) {}
  async getAll() {
    return await this.modelTypeAgreement.findAll({
      attributes: ['id', 'title'],
    });
  }
}
