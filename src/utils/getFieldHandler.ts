import { GridColDefExtend } from './Columns/Agreements/AgreementColumns';

/**
 * Получить функцию для получения модели колонки
 * @param columnModel Модель колонок
 * @returns Метод получения модели колонки
 */
export default function getFieldHandler(
  columnModel: GridColDefExtend[],
  modelName?: string,
) {
  const filter = columnModel.filter((item) =>
    modelName ? item.modelName === modelName : true,
  );
  return (name: string) => filter.find((column) => column.field === name);
}
