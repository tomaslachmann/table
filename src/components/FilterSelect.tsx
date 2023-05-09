import { useEffect, useState } from 'react';
import Select from './Select';
import { FilterVariant } from '../types';

type SelectProps = {
  multiple: boolean;
  items: (string | number)[];
  label: string;
  id: string;
  value: (string | number) | (string | number)[];
  onFilter: (value: string | number | (string | number)[], type: FilterVariant, key: string) => void;
};

export default function FilterSelect({ multiple, items, label, id, value, onFilter }: SelectProps){
  const [ options, setOptions ] = useState<string | number | (string | number)[]>(value);

  useEffect(() => {
    onFilter(options, multiple ? FilterVariant.multiSelect : FilterVariant.select, String(id));
  }, [ options, multiple, id, onFilter ]);

  return(
    <Select
      multiple={multiple}
      items={items}
      label={label}
      id={id}
      value={value}
      onChange={setOptions}
      wrapperClassName="relative mb-3 w-full"
      labelClassName={`${(Array.isArray(options) && options.length > 0) ? 'dark:bg-gray-800' : ''} peer-focus:dark:bg-gray-800 px-2 pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:bg-white peer-focus:scale-[0.8] peer-focus:text-sky-700 peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] dark:text-neutral-200 dark:peer-focus:text-sky-700`}
    />
  );
}