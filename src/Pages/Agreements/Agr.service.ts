import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { CreateAgreementInput } from './Agr.input';

export class AgreementsService {
  /*
   * нужны ли здесь caslAbility
   */
  constructor(
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
  ) {}
  async CreateAgreement(data: CreateAgreementInput) {
    const Agreement = await this.modelAgreement.create(data);
    return Agreement;
  }
  async getAgreement(index: number) {
    const Agreement = await this.modelAgreement.findByPk(index, {
      rejectOnEmpty: new NotFoundException(
        'Соглашения не найдено. Возможно оно не существует',
      ),
    });
    return Agreement;
  }
  async deleteAgreement(index: number) {
    const Agreement = await this.modelAgreement.findByPk(index, {
      rejectOnEmpty: new NotFoundException(
        'Соглашение не найдено и не удалено',
      ),
    });
    await Agreement.destroy();
    return { result: 'success' };
  }
}
