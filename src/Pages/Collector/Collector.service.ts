import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { User as UserContact } from '@contact/models';
@Injectable()
/**
 * Взыскатели
 * select * from users where r_department_id = 2 and block_flag = 0
 * select * from users where r_department_id = 50 and block_flag = 0
 */
export class CollectorService {
  constructor(
    @InjectModel(UserContact, 'contact')
    private ModelUserContact: typeof UserContact,
  ) {}
  async getAllCollectors() {
    return await this.ModelUserContact.findAll({
      where: { block_flag: 0, r_department_id: [2, 50] },
    });
  }
}
