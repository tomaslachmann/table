import { useEffect, useReducer, useState, useRef, useMemo } from 'react';
import { useAuthenticationContext } from '../contexts';
import { TiArrowUnsorted } from 'react-icons/ti';
import { MdEdit, MdDeleteForever, MdAddCircleOutline, MdSort, MdClose } from 'react-icons/md';
import { FilterVariant, SortOrder } from '../types';
import { dataTableReducer, DataTableState, PaginationPropsState } from '../reducers/DataTableReducer';
import FormInput from './FormInput';
import { removeDuplicates } from '../utils/ArrayUtils';
import Pagination from './Pagination';
import ExpandableFilter, { ExpandableFilterResult } from './ExpandableFilter';

const ITEMS_PER_PAGE = 10;
const CURRENT_PAGE = 1;
const SORT_ORDER = SortOrder.ASC;

export type ColumnProps<T> = {
  key: string;
  label: string;
  isSortable?: boolean;
  isFilterable?: boolean;
  filter?: FilterVariant;
  render: (val: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: ColumnProps<T>[];
  items: T[];
  idExtractor: (item: T) => string | number;
  itemsPerPage?: number;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onNew: () => void;
  onRowClick?: (item: T) => void;
  filterKey?: string;
  filterLabel: string;
  name: string;
};

type SortProps<T extends Record<K, string | number>, K extends keyof T> = {
  sortOrder: SortOrder;
  items: T[];
  key: K;
};

type SortPropsState = {
  order: SortOrder,
  key: string | number,
};

function sort<T extends Record<K, string | number>, K extends keyof T>({ sortOrder, items, key }: SortProps<T, K>): T[]{
  return [ ...items.sort((a, b) => {
    if(typeof a[key] === 'number' && typeof b[key] === 'number'){
      return sortOrder === SortOrder.ASC ? Number(a[key]) - Number(b[key]) : Number(b[key]) - Number(a[key]);
    }
    return sortOrder === SortOrder.ASC ? a[key].toString().localeCompare(b[key].toString()) : b[key].toString().localeCompare(a[key].toString());
  }) ];
}

const sortPropsInit: SortPropsState = Object.freeze({
  order: SORT_ORDER,
  key: '',
});


export default function DataTable<T extends Record<keyof T, string | number>>({ columns, items, idExtractor, itemsPerPage = ITEMS_PER_PAGE, onEdit, onDelete, onNew, onRowClick, filterKey, filterLabel, name }: DataTableProps<T>){
  const { user } = useAuthenticationContext();
  const [ filterExpanded, setFilterExpanded ] = useState(false);
  const lastDispatchType = useRef<string>('');

  const paginationPropsInit = useMemo<PaginationPropsState>(() => {
    const startIndex = (CURRENT_PAGE - 1) * itemsPerPage;
    return{
      totalPages: Math.ceil(items.length / itemsPerPage),
      startIndex,
      endIndex: startIndex + itemsPerPage,
      currentPage: 1,
      itemsPerPage,
    };
  }, [ items, itemsPerPage ]);

  const paginationItemsInit = useMemo<T[]>(() => {
    const startIndex = (CURRENT_PAGE - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [ items, itemsPerPage ]);

  const [ state, dispatch ] = useReducer(dataTableReducer<T>, {
    items,
    sortProps: sortPropsInit,
    paginatedItems: paginationItemsInit,
    filterProps: {
      searchTerm: '',
      test: (searchTerm: string, string: string) => new RegExp(searchTerm).test(string),
      key: filterKey,
    },
    paginationProps: paginationPropsInit,
    advancedFilters: {
      filters: [],
    },
  } as unknown as DataTableState<T>);

  useEffect(() => {
    let pageItems = state.items;
    switch (lastDispatchType.current) {
      case 'SET_ADVANCED_FILTERS':
        pageItems = filterByFilters();
        setItems(pageItems);
        break;
      case 'SET_FILTER_PROPS':
        pageItems = filterBySearch();
        setItems(pageItems);
        break;
    }
  }, [ state.filterProps, state.advancedFilters ]);

  useEffect(() => {
    dispatch({ type: 'SET_PAGINATED_ITEMS', payload: state.items.slice(state.paginationProps.startIndex, state.paginationProps.endIndex) });
  }, [ state.paginationProps, state.items, items ]);

  useEffect(() => {
    dispatch({ type: 'SET_PAGINATION_PROPS', payload: {
      ...state.paginationProps,
      totalPages: Math.ceil(state.items.length / itemsPerPage),
    } });
  }, [ state.items, itemsPerPage ]);

  function setItems(items: T[]){
    dispatch({ type: 'SET_ITEMS', payload: items });
  }

  function handleSortClick(key: keyof T) {
    if (state.sortProps.key === key) {
      dispatch({
        type: 'SET_SORT_PROPS',
        payload: {
          order: state.sortProps.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC,
          key: key.toString() as keyof T,
        },
      });
    } else {
      dispatch({
        type: 'SET_SORT_PROPS',
        payload: {
          order: SortOrder.ASC,
          key: key.toString() as keyof T,
        },
      });
    }
  }

  function handleSearch(searchTerm: string | number){
    dispatch({ type: 'SET_FILTER_PROPS', payload: {
      ...state.filterProps,
      searchTerm: String(searchTerm),
      ...(filterKey) && { keys: [ filterKey as keyof T ] },
    } });
    lastDispatchType.current = 'SET_FILTER_PROPS';
  }

  function handleFilters(filters: ExpandableFilterResult<T>[]){
    dispatch({ type: 'SET_ADVANCED_FILTERS', payload: {
      ...state.advancedFilters,
      filters,
    } });
    lastDispatchType.current = 'SET_ADVANCED_FILTERS';
  }

  function filterByFilters(){
    const filteredResults: T[] = state.advancedFilters.filters.length > 0
      ? state.advancedFilters.filters.reduce((acc: T[], filter) => {
        const filteredItems = items.filter((item) => {
          if (filter.type === FilterVariant.input) {
            return state.filterProps.test?.(
              String(filter.value),
              String(item[filter.key as keyof T]),
            ) ?? false;
          }
          return String(item[filter.key as keyof T]) === String(filter.value);
        });
        return [ ...acc, ...filteredItems ];
      }, [])
      : items;
    return [ ...new Set(filteredResults) ];
  }

  function handleFilterCancel(){
    dispatch({ type: 'SET_ADVANCED_FILTERS', payload: { filters: [] } });
    dispatch({ type: 'SET_PAGINATED_ITEMS', payload: items.slice(state.paginationProps.startIndex, state.paginationProps.endIndex) });
    dispatch({ type: 'SET_PAGINATION_PROPS', payload: {
      ...state.paginationProps,
      totalPages: Math.ceil(state.items.length / itemsPerPage),
    } });
    setFilterExpanded(false);
    lastDispatchType.current = 'SET_ADVANCED_FILTERS';
  }

  function filterBySearch(){
    const filteredArray = items
      .filter(item => {
        let final = false;
        if(state.filterProps.key){
          if(state.filterProps.test!(state.filterProps.searchTerm, String(item[state.filterProps.key]))){
            final = true;
          }
        }
        else{
          for(const prop in item){
            if(state.filterProps.test!(state.filterProps.searchTerm, String(item[prop])) || final === true){
              final = true;
            }
          }
        }
        return final;
      });
    dispatch({ type: 'SET_PAGINATION_PROPS', payload: {
      ...state.paginationProps,
      totalPages: Math.ceil(filteredArray.length / itemsPerPage),
    } });
    lastDispatchType.current = 'SET_ADVANCED_FILTERS';
    return filteredArray;
  }

  useEffect(() => {
    if(state.filterProps.searchTerm){
      lastDispatchType.current = 'SET_FILTER_PROPS';
    }
  }, [ state.filterProps ]);

  useEffect(() => {
    if(state.sortProps.key){
      dispatch({
        type: 'SET_ITEMS',
        payload: sort<T, keyof T>({
          sortOrder: state.sortProps.order,
          items: items,
          key: state.sortProps.key as keyof T,
        }),
      });
    }
  }, [ state.sortProps, items ]);

  useEffect(() => {
    dispatch({ type: 'SET_ITEMS', payload: items });
  }, [ items ]);

  function handlePageChange(pageNumber: number) {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    dispatch({ type: 'SET_PAGINATION_PROPS', payload: {
      ...state.paginationProps,
      currentPage: pageNumber,
      totalPages: Math.ceil(state.items.length / itemsPerPage),
      startIndex,
      endIndex: startIndex + itemsPerPage,
    } });
    lastDispatchType.current = 'SET_PAGINATION_PROPS';
  }

  function removeAdvancedFilter(filter: ExpandableFilterResult<T>){
    dispatch({ type: 'SET_ADVANCED_FILTERS', payload: {
      filters: [
        ...state.advancedFilters.filters.filter(f => f.key !== filter.key),
      ],
    } });
    lastDispatchType.current = 'SET_ADVANCED_FILTERS';
  }

  return(
    <div className="flex flex-col">
      <div className="overflow-x-auto scrollbar-hide sm:-mx-6 lg:-mx-8 border py-6 px-6 rounded-lg dark:bg-gray-800">
        <table className="min-w-full text-left text-sm font-light table-auto">
          <thead className="border-b font-medium dark:border-gray-600">
            <tr>
              <th colSpan={columns.length + 1} className="whitespace-nowrap px-6 py-4">
                <div className="cursor-pointer flex justify-between">
                  <FormInput<string>
                    value={String(state.filterProps.searchTerm) ?? ''}
                    onChange={handleSearch}
                    placeHolder={filterLabel}
                    id='filterInput'
                    label={filterLabel}
                    type='text'
                    labelClassName='peer-focus:dark:bg-gray-800 px-2 pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:bg-white peer-focus:scale-[0.8] peer-focus:text-sky-700 peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] dark:text-neutral-200 dark:peer-focus:text-sky-700'
                    wrapperClassName='relative w-full w-1/4'
                  />
                  <button onClick={() => setFilterExpanded(!filterExpanded)} className="text-lg -scale-x-100 ml-2 hover:bg-neutral-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 w-fit flex items-center justify-end relative block px-3 py-1.5 transition-all duration-300 rounded">
                    <MdSort />
                  </button>
                </div>
                {
                  user?.role === 'admin' &&
                  <button onClick={() => onNew()} className="ml-2 hover:bg-neutral-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 w-fit flex items-center justify-end relative block px-3 py-1.5 transition-all duration-300 rounded">
                    Add { name } <MdAddCircleOutline className="text-lg ml-2" />
                  </button>
                }
              </th>
            </tr>
            { filterExpanded &&
              <tr>
                <th colSpan={columns.length + 1} className='px-6 py-4'>
                  <ExpandableFilter<T>
                    columns={columns}
                    items={items}
                    onCancel={handleFilterCancel}
                    onSubmit={handleFilters}
                    filters={state.advancedFilters.filters}
                  /></th>
              </tr>
            }
            <tr>
              {
                columns.map((column) => {
                  return(
                    <th
                      key={column.key}
                      className={`${ column.isSortable && 'cursor-pointer' } px-6 py-4 dark:text-gray-300`}
                      onClick={() => column.isSortable ? handleSortClick(column.key as keyof T) : null}
                    >
                      <div className="flex items-center">
                        {column.label} {column.isSortable && <TiArrowUnsorted className="ml-2" />}
                      </div>
                    </th>
                  );
                })
              }
            </tr>
          </thead>
          <tbody>
            { state.advancedFilters.filters.length > 0 &&
              <tr>
                <td colSpan={columns.length + 1} className='px-6 py-4'>
                  <div className="flex items-center">
                    {
                      removeDuplicates(state.advancedFilters.filters, 'key').map((filter) => {
                        const mergedFilters = [ filter, ...state.advancedFilters.filters.filter(f => f.key === filter.key && f.value !== filter.value) ];
                        return(
                          <div key={String(filter.key)}
                            onClick={() => removeAdvancedFilter(filter)}
                            className="bg-blue-100 hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-sky-600 dark:hover:bg-sky-700 dark:text-blue-300 flex justify-between items-center"
                          >
                            { columns.find(column => column.key === filter.key)?.label }: { mergedFilters.map(f => f.value).join(', ') }
                            <MdClose className="inline-block p-0 ml-2 mt-0.5" />
                          </div>
                        );
                      })
                    }
                  </div>
                </td>
              </tr>
            }
            {
              state.paginatedItems.length > 0 ? (
                state.paginatedItems.map((item) => (
                  <tr key={idExtractor(item)} className={`${typeof onRowClick === 'function' && 'cursor-pointer'} dark:text-gray-400 dark:hover:text-gray-300 border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-gray-500 dark:hover:bg-gray-900`}>
                    {columns.map((column) => (
                      <td
                        onClick={() => typeof onRowClick === 'function' && onRowClick(item)}
                        key={column.key}
                        className="whitespace-nowrap px-6 py-4"
                      >
                        {column.render(item)}
                      </td>
                    ))}
                    {
                      user?.role === 'reader' && <td onClick={() => typeof onRowClick === 'function' && onRowClick(item)}></td>
                    }
                    {
                      user?.role === 'admin' &&
                        <td className="whitespace-nowrap px-6 py-4 text-xl text-sky-700 cursor-pointer">
                          <div className="flex items-center gap-5 justify-end">
                            <button onClick={() => onEdit(item)} className="hover:bg-blue-100 text-blue-600 px-1.5 py-1.5 transition-all duration-300 rounded">
                              <MdEdit />
                            </button>
                            <button onClick={() => onDelete(item)} className="hover:bg-blue-100 text-red-600 px-1.5 py-1.5 transition-all duration-300 rounded">
                              <MdDeleteForever />
                            </button>
                          </div>
                        </td>
                    }
                    {
                      user?.role === 'editor' &&
                        <td className="whitespace-nowrap px-6 py-4 text-xl text-sky-700 cursor-pointer">
                          <div className="flex items-center gap-5 justify-end">
                            <button onClick={() => onEdit(item)} className="hover:bg-sky-100 text-sky-700 px-1.5 py-1.5 transition-all duration-300 rounded">
                              <MdEdit />
                            </button>
                          </div>
                        </td>
                    }
                  </tr>
                ))
              )
                : (
                  <tr>
                    <td className="whitespace-nowrap px-6 py-4">
                      no data to show
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
        <div className="w-full justify-end flex pt-6">
          <Pagination currentPage={state.paginationProps.currentPage} totalPages={state.paginationProps.totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
}