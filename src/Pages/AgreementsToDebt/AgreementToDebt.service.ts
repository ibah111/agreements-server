import { Debt, Dict, Person } from '@contact/models';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import {
  AgreementToDebtInput,
  DeleteAgrementToDebtInput,
} from './AgreementToDebt.input';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import { Op, WhereOptions } from '@sql-tools/sequelize';
import {
  Action,
  CaslAbilityFactory,
} from 'src/Modules/Casl/casl-ability.factory';
import { AuthResult } from 'src/Modules/Guards/auth.guard';
import { PreviewGeneratorService } from '../../Modules/PreviewGenerator/PreviewGenerator.service';

@Injectable()
export class AgreementToDebtSerivce {
  constructor(
    @InjectModel(Debt, 'contact')
    private readonly modelDebt: typeof Debt,
    @InjectModel(Dict, 'contact') private ModelDict: typeof Dict,
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelAgreementDebtsLink: typeof AgreementDebtsLink,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(Person, 'contact')
    private readonly modelPerson: typeof Person,
    private readonly serviceAbility: CaslAbilityFactory,
    private readonly previewGenerator: PreviewGeneratorService,
  ) {}
  async createAgreementToDebt(auth: AuthResult, data: AgreementToDebtInput) {
    const ability = this.serviceAbility.createForUser(auth.userLocal);
    const agreement = await this.modelAgreement.findByPk(data.id_agreement, {
      attributes: ['id', 'person_id'],
      rejectOnEmpty: new UnprocessableEntityException(
        `Соглашение ${data.id_agreement} не найденно`,
      ),
    });
    ability.can(Action.Link, agreement);

    await this.modelDebt.findByPk(data.id_debt, {
      /**
       * могут быть приколы
       */
      having: {
        status: { [Op.notIn]: 7 },
      },
      attributes: ['id'],
      include: [
        {
          model: this.ModelDict,
          as: 'StatusDict',
          attributes: ['name'],
        },
        {
          model: this.modelPerson,
          where: { id: agreement.person_id } as WhereOptions<Person>,
          required: true,
        },
      ],
      rejectOnEmpty: new UnprocessableEntityException(
        `Долг ${data.id_debt} не найден`,
      ),
    });

    const [agreementToDebt, created] =
      await this.modelAgreementDebtsLink.findOrCreate({
        where: { id_agreement: data.id_agreement, id_debt: data.id_debt },
        defaults: { id_agreement: data.id_agreement, id_debt: data.id_debt },
      });
    const preview_debt = this.previewGenerator.updateCurrentAgreement(
      data.id_agreement,
    );
    if (created) return [agreementToDebt, preview_debt];
    else return;
  }

  async deleteAgreementToDebt(data: DeleteAgrementToDebtInput) {
    const number = await this.modelAgreementDebtsLink.destroy({
      where: { id_agreement: data.id_agreement, id_debt: data.id_debt },
    });
    this.previewGenerator.updateCurrentAgreement(data.id_agreement);
    return number > 0;
  }

  async getLinkedDebts(id_agreement: number) {
    const links = await this.modelAgreementDebtsLink.findAll({
      where: { id_agreement: id_agreement },
    });

    return links;
  }

  async getAvailableDebts(id_person: number) {
    const agreement = await this.modelAgreement.findByPk(id_person, {
      attributes: ['id', 'person_id'],
      rejectOnEmpty: new NotFoundException(
        `Не найденно соглашение ${id_person}`,
      ),
      include: { model: this.modelAgreementDebtsLink, attributes: ['id_debt'] },
    });
    const linkedDebts = agreement.DebtLinks?.map((link) => link.id_debt);
    const personAgreement = await this.modelPerson.findByPk(
      agreement.person_id,
      {
        include: {
          required: false,
          model: this.modelDebt,
          where: {
            id: { [Op.notIn]: linkedDebts },
            status: {
              [Op.notIn]: [7],
            },
          } as WhereOptions<Debt>,
        },

        rejectOnEmpty: new NotFoundException(
          `Не найден человек с Id ${agreement.person_id}`,
        ),
      },
    );
    const personDebts = personAgreement.Debts as Debt[];
    return personDebts;
  }
}
