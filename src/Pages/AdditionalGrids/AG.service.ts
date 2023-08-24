import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import { ActionLog } from '../../Modules/Database/Local.Database/models/ActionLog';
import { Op } from '@sql-tools/sequelize';
import { User_Role } from '../../Modules/Database/Local.Database/models/User_Role.model';
import { User } from '../../Modules/Database/Local.Database/models/User.model';
import { Role } from '../../Modules/Database/Local.Database/models/Role.model';
import { DataGridClass } from '../DataGridClass/DataGridClass';
import getSize from '../../utils/getSize';

@Injectable()
export class AdditionalGridService {
  constructor(
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(ActionLog, 'local')
    private readonly modelActionLog: typeof ActionLog,
    @InjectModel(User_Role, 'local')
    private readonly modelUserRole: typeof User_Role,
    @InjectModel(User, 'local')
    private readonly modelUser: typeof User,
    @InjectModel(Role, 'local')
    private readonly modelRole: typeof Role,
  ) {}
  /** Логи */
  async getLogs(body: DataGridClass) {
    const size = getSize(body.paginationModel.pageSize);
    const logs = await this.modelActionLog.findAll({});
  }
  /**
   * @TODO Сделать пагинацию (лимиты и оффсеты)
   * @returns all deleted data (pararanoid - false => showing all soft-deleted data's)
   */
  async getDeleted(body: DataGridClass) {
    const size = getSize(body.paginationModel.pageSize);
    const del = await this.modelAgreement.findAll({
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
      paranoid: false,
    });
  }

  /**
   * restore soft-deleted content
   */
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
  }
  /**
   * forcefull delete of soft-deleted content
   */
  async forceDelete(id_agreement: number) {
    const del_agr = await this.modelAgreement.findOne({
      where: {
        id: id_agreement,
      },
      rejectOnEmpty: new NotFoundException(
        'Удаленное соглашение не найдено. Возможно оно не удалено.',
      ),
      paranoid: false,
    });
    if (del_agr) return del_agr?.destroy({ force: true });
  }

  async getAllUsers(body: DataGridClass) {
    const size = getSize(body.paginationModel.pageSize);
    const users = await this.modelUser.findAll({
      include: [
        {
          model: this.modelRole,
          attributes: ['id', 'title', 'name'],
        },
      ],
    });
  }
}
