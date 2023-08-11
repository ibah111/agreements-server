import { GridColDef, GridValidRowModel } from '@mui/x-data-grid-premium';
import { Model, ModelStatic, Utils } from '@sql-tools/sequelize';

export type OrderItemAssociation = ModelStatic<Model>;
export type SortOrder =
  | [OrderItemAssociation]
  | [OrderItemAssociation, OrderItemAssociation]
  | [OrderItemAssociation, OrderItemAssociation, OrderItemAssociation]
  | [
      OrderItemAssociation,
      OrderItemAssociation,
      OrderItemAssociation,
      OrderItemAssociation,
    ];

export interface AddonData {
  model: string;
  col: string | Utils.Fn;
  base: string;
  sortOrder?: SortOrder;
}

export type GridColDefAddon<T extends GridValidRowModel = any> = GridColDef<T> &
  AddonData;

export interface ResultColumn<T> extends AddonData {
  field: T;
  editable: boolean;
  type: GridColDef['type'];
}

export const generateDefaults = (base: string, model: string) => {
  return (field: string) => ({
    field,
    col: field,
    model,
    base,
  });
};
