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
import { getLogsUtils } from '../../utils/Columns/AG/Logs/utils.Logs';
import _ from 'lodash';
import { getDeletedUtils } from '../../utils/Columns/AG/Deleted/utils.Deleted';
import { getUserUtils } from '../../utils/Columns/AG/Users/utils.Logs';

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
    const logs_utils = getLogsUtils();
    const logs_filter = logs_utils.generateFilter(body.filterModel);
    const logs_sort = logs_utils.generateSort(body.sortModel || []);
    const logs_ids = await this.modelActionLog.findAll({
      where: logs_filter('ActionLog'),
    });
    const logs = await this.modelActionLog.findAndCountAll({
      offset: body.paginationModel.page * size,
      limit: size,
      where: {
        [Op.and]: [
          {
            id: {
              [Op.in]: _.uniq(logs_ids.map((item) => item.id)),
            },
          },
        ],
      },
      order: logs_sort('local'),
    });
    return logs;
  }
  /**
   * @TODO Сделать пагинацию (лимиты и оффсеты)
   * @returns all deleted data (pararanoid - false => showing all soft-deleted data's)
   */
  async getDeleted(body: DataGridClass) {
    const size = getSize(body.paginationModel.pageSize);
    const del_utils = getDeletedUtils();
    const del_filter = del_utils.generateFilter(body.filterModel);
    const del_sort = del_utils.generateSort(body.sortModel || []);
    const del_ids = await this.modelAgreement.findAll({
      where: del_filter('local'),
    });
    const del = await this.modelAgreement.findAndCountAll({
      paranoid: false,
      offset: body.paginationModel.page * size,
      limit: size,
      where: {
        [Op.and]: [
          {
            id: {
              [Op.in]: _.uniq(del_ids.map((item) => item.id)),
            },
            deletedAt: {
              [Op.not]: null,
            },
          },
        ],
      },
      order: del_sort('local'),
    });
    return del;
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
    const user_utils = getUserUtils();
    const user_filter = user_utils.generateFilter(body.filterModel);
    const user_sort = user_utils.generateSort(body.sortModel || []);
    const users_ids = await this.modelUser.findAll({
      where: user_filter('local'),
    });
    const users = await this.modelUser.findAndCountAll({
      limit: size,
      offset: body.paginationModel.page * size,
      where: {
        [Op.and]: [
          {
            id: {
              [Op.in]: _.uniq(users_ids.map((item) => item.id)),
            },
          },
        ],
      },
      order: user_sort('local'),
      include: [
        {
          model: this.modelRole,
          attributes: ['id', 'title', 'name'],
        },
      ],
    });
    return users;
  }
}
