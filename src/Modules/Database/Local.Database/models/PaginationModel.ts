import {
  GridFilterModel,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
} from '@mui/x-data-grid-premium';

export class PaginationModel {
  filterModel: GridFilterModel;
  paginationModel: GridPaginationModel;
  selectionModel: GridRowSelectionModel;
  sortModel: GridSortModel;
}
