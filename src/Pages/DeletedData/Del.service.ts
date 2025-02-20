import { Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { AgrDelInput } from './Del.input';

@Injectable()
export class DelService {
  constructor(
    @InjectModel(Agreement, 'local')
    private readonly modelDeletedAgreement: typeof Agreement,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAllDeleted(body: AgrDelInput) {
    this.modelDeletedAgreement.findAll({});
  }
}
