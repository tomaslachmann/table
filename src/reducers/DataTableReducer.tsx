import { ExpandableFilterResult } from '../components/ExpandableFilter';
import { SortOrder } from '../types';

export type SortPropsState<T> = {
  order: SortOrder;
  key: keyof T;
};

export type FilterPropsState<T> = {
  key?: keyof T;
  searchTerm: string;
  test?: (searchTerm: string, val: string) => boolean;
};

export type PaginationPropsState = {
  totalPages: number;
  startIndex: number;
  endIndex: number;
  currentPage: number;
  itemsPerPage: number;
};

export type AdvancedFiltersState<T> = {
  filters: ExpandableFilterResult<T>[];
};

export type DataTableState<T> = {
  items: T[];
  sortProps: SortPropsState<T>;
  paginatedItems: T[];
  filterProps: FilterPropsState<T>;
  paginationProps: PaginationPropsState;
  advancedFilters: AdvancedFiltersState<T>;
};

export type DataTableAction<T> =
  | { type: 'SET_ITEMS'; payload: T[] }
  | { type: 'SET_SORT_PROPS'; payload: SortPropsState<T> }
  | { type: 'SET_PAGINATED_ITEMS'; payload: T[] }
  | { type: 'SET_FILTER_PROPS'; payload: FilterPropsState<T> }
  | { type: 'SET_PAGINATION_PROPS'; payload: PaginationPropsState }
  | { type: 'SET_ADVANCED_FILTERS'; payload: AdvancedFiltersState<T> };

export function dataTableReducer<T extends Record<keyof T, string | number>>(
  state: DataTableState<T>,
  action: DataTableAction<T>,
): DataTableState<T> {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'SET_SORT_PROPS':
      return { ...state, sortProps: action.payload };
    case 'SET_PAGINATED_ITEMS':
      return { ...state, paginatedItems: action.payload };
    case 'SET_FILTER_PROPS':
      return { ...state, filterProps: action.payload };
    case 'SET_ADVANCED_FILTERS':
      return { ...state, advancedFilters: action.payload };
    case 'SET_PAGINATION_PROPS':
      return { ...state, paginationProps: action.payload };
    default:
      throw new Error('Unhandled action type');
  }
}