import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import { ActionLog } from '../../Modules/Database/Local.Database/models/ActionLog';
import { Op } from '@sql-tools/sequelize';

@Injectable()
export class AdditionalGridService {
  constructor(
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(ActionLog, 'local')
    private readonly modelActionLog: typeof ActionLog,
  ) {}

  async getLogs() {
    const logs = await this.modelActionLog.findAll({});
    return logs;
  }

  async getDeleted() {
    const del = await this.modelAgreement.findAll({
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
      paranoid: false,
    });
    return del;
  }

  async restoreDeleted(id_agreement: number) {
    const del_agr = await this.modelAgreement.findOne({
      where: {
        id: id_agreement,
      },
      rejectOnEmpty: new NotFoundException(
        'Удаленное соглашение не найдено. Возможно оно не удалено.',
      ),
      paranoid: false,
    });
    if (del_agr) return del_agr?.restore();
    else console.log('Ошибка');
  }
}
