import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { Department, User as UserContact } from '@contact/models';
import { Op, Sequelize } from '@sql-tools/sequelize';
import { Collectors } from 'src/Modules/Database/Local.Database/models/Collectors';
import { CreateCollectorInput } from './Collector.input';
@Injectable()
/**
 * Взыскатели
 * select * from users where r_department_id = 2 and block_flag = 0
 * select * from users where r_department_id = 50 and block_flag = 0
 */
export class CollectorService {
  constructor(
    @InjectModel(UserContact, 'contact')
    private modelUserContact: typeof UserContact,
    @InjectModel(Department, 'contact')
    private modelDepartment: typeof Department,
    @InjectModel(Collectors, 'local')
    private modelCollector: typeof Collectors,
  ) {}
  async getAllCollectors() {
    return await this.modelCollector.findAll({});
  }

  async searchUser(fio: string) {
    return await this.modelUserContact.findAll({
      where: fio
        ? Sequelize.where(
            Sequelize.fn(
              'concat',
              Sequelize.col('f'),
              ' ',
              Sequelize.col('i'),
              ' ',
              Sequelize.col('o'),
            ),
            {
              [Op.like]: `%${fio}%`,
            },
          )
        : undefined,
      attributes: ['id', 'f', 'i', 'o'],
      limit: 25,
      include: [
        {
          model: this.modelDepartment,
          attributes: ['id', 'dep', 'name', 'r_dep'],
        },
      ],
    });
  }

  async addCollector(body: CreateCollectorInput) {
    const checkExist = await this.modelCollector.findOne({
      where: {
        id_contact: body.id_contact,
      },
    });
    if (checkExist) throw Error('Коллектор существует в списке');
    else if (!checkExist) return await this.modelCollector.create(body);
  }

  async deleteCollector(id: number) {
    return await this.modelCollector.destroy({
      where: {
        id,
      },
    });
  }
}
