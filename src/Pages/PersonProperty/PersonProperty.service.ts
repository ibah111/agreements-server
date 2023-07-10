import { PersonProperty } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';

@Injectable()
export class PersonPropertyService {
  constructor(
    @InjectModel(PersonProperty, 'contact')
    private readonly modelPersonProperties: typeof PersonProperty,
  ) {}
  async getPersonProperties(person_id: number) {
    const pp = await this.modelPersonProperties.findAll({
      attributes: ['id'],
      where: { r_person_id: person_id },
      include: [
        {
          association: 'PersonPropertyParams',
          attributes: ['r_property_typ_params_id', 'value'],
        },
      ],
    });
    return pp;
  }
}
