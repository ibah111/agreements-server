import { Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { StatusAgreement } from 'src/Modules/Database/Local.Database/models/StatusAgreement';

@Injectable()
export default class StatusAgreementService {
  constructor(
    @InjectModel(StatusAgreement, 'local')
    private readonly modelStatusAgreement: typeof StatusAgreement,
  ) {}
  async getAll() {
    return await this.modelStatusAgreement.findAll({
      attributes: ['id', 'title'],
    });
  }
}
