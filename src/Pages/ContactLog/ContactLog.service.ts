import { Person, ContactLog, Phone, DebtGuarantor } from '@contact/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Op } from '@sql-tools/sequelize';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';

@Injectable()
export class ContactLogService {
  constructor(
    @InjectModel(Person, 'contact')
    private readonly modelPerson: typeof Person,
    @InjectModel(DebtGuarantor, 'contact')
    private readonly modelDebtGuarantor: typeof DebtGuarantor,
    @InjectModel(ContactLog, 'contact')
    private readonly modelContactLog: typeof ContactLog,
    @InjectModel(Phone, 'contact')
    private readonly modelPhone: typeof Phone,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelAgreementDebtsLink: typeof Agreement,
  ) {}
  async getContactLogInfo(id_agreement: number) {
    const agreement = await this.modelAgreement.findOne({
      where: {
        id: id_agreement,
      },
      include: [
        {
          model: this.modelAgreementDebtsLink,
        },
      ],
      rejectOnEmpty: new NotFoundException('Соглас не найден'),
    });
    const debt_collection = agreement.DebtLinks?.map((i) => i.id_debt);

    return await this.modelContactLog.findAll({
      include: [
        {
          model: this.modelPhone,
          attributes: [
            'id',
            'parent_id',
            'number',
            'number2',
            'status',
            'contact_face',
          ],
        },
        {
          model: this.modelDebtGuarantor,
          attributes: ['id', 'parent_id', 'fio', 'birth_date', 'typ', 'dsc'],
        },
      ],
      where: {
        parent_id: agreement.person_id,
        r_debt_id: {
          [Op.in]: debt_collection,
        },
      },
      attributes: [
        'id',
        'parent_id',
        'r_debt_id',
        'r_phone_id',
        'dsc',
        'typ',
        'r_reg_user_id',
        'reg_dt',
        'r_debt_guarantor_id',
      ],
      logging: console.log,
    });
  }
}
