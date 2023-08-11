import { Person, PersonProperty } from '@contact/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { ActionLinkPersonPropertyInput } from './PersonProperty.input';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import AgreementToPersonProperties from '../../Modules/Database/Local.Database/models/AgreementToPersonProperties';
import { Op, WhereOptions } from '@sql-tools/sequelize';
import { CaslAbilityFactory } from '../../Modules/Casl/casl-ability.factory';

@Injectable()
export class PersonPropertyService {
  constructor(
    @InjectModel(PersonProperty, 'contact')
    private readonly modelPersonProperties: typeof PersonProperty,
    @InjectModel(Person, 'contact')
    private readonly modelPerson: typeof Person,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(AgreementToPersonProperties, 'local')
    private readonly modelAgreementToPersonProperties: typeof AgreementToPersonProperties,
    private readonly serviceAbility: CaslAbilityFactory,
  ) {}
  async getLinkedPersonProperties(id_agreement: number) {
    const linkedProps = await this.modelAgreementToPersonProperties.findAll({
      where: { id_agreement: id_agreement },
    });
    const person_props_ids = linkedProps.map(
      (linkedProps) => linkedProps.id_person_property,
    );
    const all_props = await this.modelPersonProperties.findAll({
      where: { id: { [Op.in]: person_props_ids } },
      attributes: [
        'id',
        'r_person_id',
        'sum',
        'dsc',
        'fio',
        'r_debt_id',
        'currency',
      ],
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
    return all_props;
  }
  /**
   * @param person_id from agreementModel
   * @returns gets property params
   */
  async getPersonProperties(person_id: number) {
    const pp = await this.modelPersonProperties.findAll({
      attributes: ['id', 'status', 'fio'],
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
  /**
   * @param auth result of auth
   * @param data default input class
   * @returns creating/adding link from agr to pers_prop
   */
  async createLinkPersonPropertyToAgreement(
    data: ActionLinkPersonPropertyInput,
  ) {
    /**
     * 
    const ability = this.serviceAbility.createForUser(auth.userLocal);
    const agreement = await this.modelAgreement.findByPk(data.id_agreement, {
      attributes: ['id', 'person_id'],
      rejectOnEmpty: new UnprocessableEntityException(
        `Соглашение ${data.id_agreement} не найденно`,
      ),
    });
     */

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
  }
  /**
   * @param data default input class
   * @returns destroying link
   */
  async deleteLinkPersonProperties(data: ActionLinkPersonPropertyInput) {
    return await this.modelAgreementToPersonProperties.destroy({
      where: {
        id_agreement: data.id_agreement,
        id_person_property: data.id_person_property,
      },
    });
  }
  async getAvailableProperties(id_agreement: number) {
    const agreement = await this.modelAgreement.findByPk(id_agreement, {
      attributes: ['id', 'id_person'],
      include: {
        model: this.modelAgreementToPersonProperties,
        attributes: ['id_person_property'],
      },
      rejectOnEmpty: new NotFoundException(
        `Соглашение #${id_agreement} не найдено`,
      ),
    });
    const linkedProperties = agreement.PersonPropertiesLinks?.map(
      (link) => link.id_person_property,
    );
    const personProperty = await this.modelPerson.findByPk(
      agreement.person_id,
      {
        include: {
          required: false,
          model: this.modelPersonProperties,
          where: {
            id: { [Op.in]: linkedProperties } as WhereOptions<PersonProperty>,
          },
        },
        rejectOnEmpty: new NotFoundException(
          `Не найден чел с id №${agreement.person_id}`,
        ),
      },
    );
    const personProperties =
      personProperty.PersonProperties as PersonProperty[];
    return personProperties;
  }
}
