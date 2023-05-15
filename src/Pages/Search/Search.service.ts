import { Debt, Person } from '@contact/models';
import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Attributes, FindOptions, Op, Sequelize } from '@sql-tools/sequelize';
@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Person, 'contact')
    private modelPerson: typeof Person,
    @InjectModel(Debt, 'contact') private modelDebt: typeof Debt,
  ) {}
  async search(fio: string, contract: string) {
    const optionsDebt: FindOptions<Attributes<Debt>> = {};

    if (contract)
      optionsDebt.where = contract
        ? { contract: { [Op.startsWith]: contract } }
        : undefined;

    optionsDebt.include = [
      'StatusDict',
      {
        model: this.modelPerson,
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
              { [Op.like]: `%${fio}%` },
            )
          : undefined,
        attributes: ['f', 'i', 'o', 'id', 'fio', 'birth_date'],
      },
    ];
    optionsDebt.limit = 25;
    const debt = await this.modelDebt.findAll(optionsDebt);
    return debt;
  }
}
