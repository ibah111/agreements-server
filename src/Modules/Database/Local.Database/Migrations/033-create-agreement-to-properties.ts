import { DataTypes, QueryInterface } from '@sql-tools/sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  await context.createTable('AgreementToProperties', {
    id_person_property: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    id_agreement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  });
};
export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  await context.dropTable('AgreementToProperties');
};
