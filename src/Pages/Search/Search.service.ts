import {
  Address,
  Debt,
  DebtGuarantor,
  Dict,
  LawAct,
  LawExec,
  LawExecPersonLink,
  Person,
  Portfolio,
} from '@contact/models';
import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Op, Sequelize } from '@sql-tools/sequelize';
import dottie from 'dottie';
import { SearchInput } from './Search.input';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Person, 'contact')
    private ModelPerson: typeof Person,
    @InjectModel(LawExec, 'contact')
    private ModelLawExec: typeof LawExec,
    @InjectModel(Portfolio, 'contact')
    private ModelPortfolio: typeof Portfolio,
    @InjectModel(Debt, 'contact') private ModelDebt: typeof Debt,
    @InjectModel(Dict, 'contact') private ModelDict: typeof Dict,
    @InjectModel(Address, 'contact') private ModelAddress: typeof Address,
    @InjectModel(LawAct, 'contact') private ModelLawAct: typeof LawAct,
    @InjectModel(LawExecPersonLink, 'contact')
    private readonly ModelLawExecPersonLink: typeof LawExecPersonLink,
    @InjectModel(DebtGuarantor, 'contact')
    private ModelDebtGuarantor: typeof DebtGuarantor,
  ) {}
  async search(body: SearchInput) {
    const result = await this.ModelLawExec.findAll({
      where: { state: { [Op.notIn]: [5] } },
      attributes: [
        'id',
        'court_doc_num',
        'executive_typ',
        'fssp_doc_num',
        'court_date',
        'entry_force_dt',
      ],
      include: [
        {
          model: this.ModelLawExecPersonLink,
          required: false,
          where: { PERSON_ROLE: 2 },
          include: [
            { model: this.ModelDebtGuarantor, attributes: ['id', 'fio'] },
          ],
        },
        {
          model: this.ModelDict,
          as: 'StateDict',
          attributes: ['name'],
        },
        {
          model: this.ModelLawAct,
          where: {
            [Op.or]: [
              { status: { [Op.notIn]: [10] }, typ: { [Op.in]: [1] } },
              {
                act_status: { [Op.notIn]: [15] },
                typ: { [Op.in]: [0, 2, 3, 4] },
              },
            ],
          },
          include: [
            {
              model: this.ModelDict,
              as: 'StatusDict',
              attributes: ['name'],
            },
            {
              model: this.ModelDict,
              as: 'ActStatusDict',
              attributes: ['name'],
            },
          ],
          attributes: ['id', 'typ'],
        },
        { model: this.ModelPortfolio, attributes: ['name'] },
        { model: this.ModelDict, as: 'ExecutiveTyp', attributes: ['name'] },
        {
          model: this.ModelDebt,
          attributes: ['id', 'contract', 'debt_sum', 'status', 'name'],
          where: {
            status: { [Op.notIn]: [] },
            ...(body.contract ? { contract: body.contract } : {}),
          },
          include: [
            {
              model: this.ModelDict,
              as: 'StatusDict',
              attributes: ['name'],
            },
          ],
        },
        {
          model: this.ModelPerson,
          include: [
            {
              model: this.ModelAddress,
              where: { typ: 1 },
              attributes: ['full_adr'],
              limit: 1,
            },
          ],
          where: body.name
            ? Sequelize.where(
                Sequelize.fn(
                  'concat',
                  Sequelize.col('f'),
                  ' ',
                  Sequelize.col('i'),
                  ' ',
                  Sequelize.col('o'),
                ),
                { [Op.like]: `%${body.name}%` },
              )
            : {},
          attributes: ['id', 'f', 'i', 'o', [Sequelize.literal("''"), 'fio']],
        },
      ],
      limit: 25,
    });
    return JSON.parse(JSON.stringify(result)).map((res: LawExec) =>
      dottie.flatten(res),
    );
  }
}
