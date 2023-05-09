import { useEffect, useState } from 'react';
import FormInput from './FormInput';
import { FilterVariant } from '../types';

type FilterInputProps = {
  onFilter: (value: string | number | (string | number)[], type: FilterVariant, key: string) => void;
  label: string;
  id: string;
  value?: string;
  placeholder?: string;
};

export default function FilterInput({ onFilter, label, id, value = '', placeholder = '' }: FilterInputProps){
  const [ inputValue, setInputValue ] = useState(value);

  useEffect(() => {
    onFilter(inputValue, FilterVariant.input, String(id));
  }, [ inputValue, id, onFilter ]);

  return(
    <FormInput
      label={label}
      value={value}
      id={id}
      placeHolder={placeholder}
      onChange={setInputValue}
      type="text"
      wrapperClassName="relative mb-3 w-full"
      labelClassName={`${inputValue ? 'dark:bg-gray-800' : ''} peer-focus:dark:bg-gray-800 px-2 pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:bg-white peer-focus:scale-[0.8] peer-focus:text-sky-700 peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] dark:text-neutral-200 dark:peer-focus:text-sky-700`}
    />
  );
}