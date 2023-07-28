import { PersonProperty } from '@contact/models';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { CreateLinkPersonPropertyInput } from './PersonProperty.input';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import AgreementToPersonProperties from '../../Modules/Database/Local.Database/models/AgreementToPersonProperties';
import {
  Action,
  CaslAbilityFactory,
} from '../../Modules/Casl/casl-ability.factory';
import { AuthResult } from '../../Modules/Guards/auth.guard';

@Injectable()
export class PersonPropertyService {
  constructor(
    @InjectModel(PersonProperty, 'contact')
    private readonly modelPersonProperties: typeof PersonProperty,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(AgreementToPersonProperties, 'local')
    private readonly modelAgreementToPersonProperties: typeof AgreementToPersonProperties,
    private readonly serviceAbility: CaslAbilityFactory,
  ) {}
  async getPersonProperties(person_id: number) {
    const pp = await this.modelPersonProperties.findAll({
      attributes: ['id', 'status'],
      where: { r_person_id: person_id },
      include: [
        {
          association: 'StatusDict',
          attributes: ['name'],
        },
        {
          association: 'PersonPropertyParams',
          attributes: ['r_property_typ_params_id', 'value'],
        },
      ],
    });
    return pp;
  }
  async getAvailableProperties() {
    return;
  }
  async createLinkPersonPropertyToAgreement(
    auth: AuthResult,
    data: CreateLinkPersonPropertyInput,
  ) {
    const ability = this.serviceAbility.createForUser(auth.userLocal);
    const agreement = await this.modelAgreement.findByPk(data.id_agreement, {
      attributes: ['id', 'person_id'],
      rejectOnEmpty: new UnprocessableEntityException(
        `Соглашение ${data.id_agreement} не найденно`,
      ),
    });
    ability.can(Action.Link, agreement);

    await this.modelPersonProperties.findByPk(data.id_person_property, {
      attributes: ['id'],
      include: [
        {
          association: 'StatusDict',
          attributes: ['name'],
        },
        {
          association: 'PersonPropertyParams',
          attributes: ['r_property_typ_params_id', 'value'],
        },
      ],
    });

    const [agreementToPersonProperty, created] =
      await this.modelAgreementToPersonProperties.findOrCreate({
        where: {
          id_agreement: data.id_agreement,
          id_person_property: data.id_person_property,
        },
      });
    if (created) return agreementToPersonProperty;

    return;
  }
  async deleteLinkPersonProperties() {
    return;
  }
}
