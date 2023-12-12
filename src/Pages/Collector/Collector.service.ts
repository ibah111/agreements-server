import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Department, User as UserContact } from '@contact/models';
import { Op, Sequelize } from '@sql-tools/sequelize';
import { Collectors } from 'src/Modules/Database/Local.Database/models/Collectors';
import { CreateCollectorInput } from './Collector.input';
@Injectable()
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
    const searchParameter = Sequelize.where(
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
    ) as unknown as string;
    console.log(searchParameter);
    return await this.modelUserContact.findAll({
      where: {
        block_flag: 0,
        fio: searchParameter,
      },
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
    if (checkExist)
      throw new HttpException(
        {
          error: `Коллектор ${body.fio} уже добавлен в список коллекторов.`,
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
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
