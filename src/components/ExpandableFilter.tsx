import { useState, useEffect, useCallback } from 'react';
import Button from './Button';
import { FilterVariant, ButtonVariant } from '../types';
import { ColumnProps } from './DataTable';
import FilterInput from './FilterInput';
import FilterSelect from './FilterSelect';

export type ExpandableFiltersProps<T> = {
  columns: ColumnProps<T>[];
  items: T[];
  onCancel: () => void;
  onSubmit: (val: ExpandableFilterResult<T>[]) => void;
  filters: ExpandableFilterResult<T>[]
};

export type ExpandableFilterResult<T> = {
  type: FilterVariant;
  key: keyof T;
  value: string | number;
};

function handleFilterResult<T>(value: string | number | (string | number)[], type: FilterVariant, key: string, array: ExpandableFilterResult<T>[], callback: (val: ExpandableFilterResult<T>[]) => void) {
  const removeDuplicate = array.filter(res => res.key !== key);
  const typedKey = key as keyof T;
  if (Array.isArray(value)) {
    callback([ ...removeDuplicate, ...value.map(val => {
      return {
        type,
        key: typedKey,
        value: val,
      };
    }) ]);
  } else {
    callback([ ...removeDuplicate, { type, value, key: typedKey }]);
  }
}

export default function ExpandableFilters<T>({ columns, items, onSubmit, onCancel, filters = [] }: ExpandableFiltersProps<T>){
  const [ filterResult, setFilterResult ] = useState<ExpandableFilterResult<T>[]>(filters);
  const filterArr = columns.filter(col => col.isFilterable);

  useEffect(() => {
    setFilterResult(filters);
  }, [ filters ]);

  const handleFilter = useCallback((value: string | number | (string | number)[], type: FilterVariant, key: string) => {
    handleFilterResult<T>(value, type, key, filterResult, setFilterResult);
  }, []);

  return(
    <div className="space-y-4">
      {
        filterArr.map(col => {
          const selectArr: string[] = [];
          items.forEach((item) => {
            if(!selectArr.includes(String(col.render(item)))){
              selectArr.push(String(col.render(item)));
            }
          });
          return(
            col.filter === FilterVariant.input ?
              <FilterInput
                key={col.key}
                value={String(filterResult.find(res => res.key === col.key)?.value ?? '')}
                id={col.key}
                label={col.label}
                placeholder={col.label}
                onFilter={handleFilter}
              /> :
              <FilterSelect
                multiple={col.filter === FilterVariant.multiSelect}
                value={filterResult.filter(res => res.key === col.key).map(val => val.value)}
                items={selectArr}
                key={col.key}
                label={col.label}
                id={col.key}
                onFilter={handleFilter}
              />
          );
        })
      }
      {
        filterArr.length > 0 && <>
          <Button type={ButtonVariant.success} onClick={() => onSubmit(filterResult)}>Filter</Button>
          <Button type={ButtonVariant.normal} onClick={() => onCancel()}>Cancel</Button>
        </>
      }
    </div>
  );
}