import { useEffect, useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';

type SelectProps = {
  multiple: boolean;
  items: (string | number)[];
  label: string;
  id: string;
  value: (string | number) | (string | number)[];
  wrapperClassName?: string;
  selectClassName?: string;
  labelClassName?: string;
  onChange: (val: (string | number)[]) => void;
};

type Options = {
  selected: boolean;
  value: string | number;
};

function StyledCheckbox({ checked = false, value }: { checked: boolean, value: string | number }){
  const [ isChecked, setIsChecked ] = useState(checked);

  function handleCheckboxChange() {
    setIsChecked(!isChecked);
  }

  return(
    <input type='checkbox' checked={checked} onChange={handleCheckboxChange} value={value} readOnly className="relative float-left mt-[0.15rem] mr-[8px] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 dark:border-neutral-600 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-blue-500 dark:checked:border-blue-500 checked:bg-blue-500 dark:checked:bg-blue-500 checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem] checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent" />
  );
}

function Option({ onClick, item, multiple, textClass = '' }: { onClick: (val: string | number) => void, item: Options, multiple: boolean, textClass?: string }){

  return(
    <div onClick={() => onClick(item.value)} className="py-2 flex flex-row items-center justify-start w-full px-4 truncate text-gray-700 bg-transparent select-none cursor-pointer data-[te-input-multiple-active]:bg-black/5 hover:[&:not([data-te-select-option-disabled])]:bg-black/5 data-[te-input-state-active]:bg-black/5 data-[te-select-option-selected]:data-[te-input-state-active]:bg-black/5 data-[te-select-selected]:data-[te-select-option-disabled]:cursor-default data-[te-select-selected]:data-[te-select-option-disabled]:text-gray-400 data-[te-select-selected]:data-[te-select-option-disabled]:bg-transparent data-[te-select-option-selected]:bg-black/[0.02] data-[te-select-option-disabled]:text-gray-400 data-[te-select-option-disabled]:cursor-default group-data-[te-select-option-group-ref]/opt:pl-7 dark:text-gray-200 dark:hover:[&:not([data-te-select-option-disabled])]:bg-white/30 dark:data-[te-input-state-active]:bg-white/30 dark:data-[te-select-option-selected]:data-[te-input-state-active]:bg-white/30 dark:data-[te-select-option-disabled]:text-gray-400 dark:data-[te-input-multiple-active]:bg-white/30">
      <span className={textClass}>{multiple && <StyledCheckbox value={item.value} checked={item.selected} />}{item.value}</span>
    </div>
  );
}

export default function Select({ multiple, items, onChange, label, id, wrapperClassName, selectClassName, labelClassName, value }: SelectProps){
  const [ selectValue, setSelectValue ] = useState<(string | number)>('');
  const [ open, setOpen ] = useState(false);
  const [ selectAll, setSelectAll ] = useState({ selected: false, value: 'Select all' });
  const [ options, setOptions ] = useState<Options[]>(items.map((item) => {
    return{
      selected: Array.isArray(value) ? value.includes(item) : value === item,
      value: item,
    };
  }));
  useEffect(() => {
    setOptions(items.map((item) => {
      return{
        selected: Array.isArray(value) ? value.includes(item) : value === item,
        value: item,
      };
    }));
    setSelectValue(Array.isArray(value) ? value.join(', ') : value);
  }, [ value, items ]);

  function handleSelectAll(){
    setOptions([ ...options.map(opt => {
      return {
        value: opt.value,
        selected: !selectAll.selected,
      };
    }) ]);
    setSelectAll({ ...selectAll, selected: !selectAll.selected });
  }

  function handleDeselect(){
    setOptions([ ...options.map(opt => {
      return {
        value: opt.value,
        selected: false,
      };
    }) ]);
    setOpen(false);
  }

  function handleClick(val: string | number){
    setOptions([ ...options.map(opt => {
      if(val === opt.value && multiple){
        return {
          value: opt.value,
          selected: !opt.selected,
        };
      }
      else if(!multiple){
        return {
          value: opt.value,
          selected: opt.value === val ? true : false,
        };
      }
      return opt;
    }) ]);
    !multiple && setOpen(false);
  }

  useEffect(() => {
    setSelectValue(options.filter(opt => opt.selected).map(opt => opt.value).join(', '));
  }, [ options ]);

  useEffect(() => {
    function handleValue(){
      const selected = options.filter(opt => opt.selected).map(val => val.value);
      onChange(selected);
    }
    handleValue();
  }, [ selectValue ]);

  return(
    <div className={wrapperClassName ?? 'cursor-pointer relative mb-3 w-3/4'}>
      <div className="relative w-full" onClick={() => setOpen(!open)}>
        <input
          value={selectValue}
          id={id}
          type='text'
          className={selectClassName ?? 'cursor-pointer peer focus:border-sky-700 focus:border-2 block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-sky-700 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-sky-700 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0'}
          readOnly
        />
        <label
          htmlFor={id}
          className={`${selectValue && '-translate-y-[0.9rem] scale-[0.8] text-sky-700 bg-white dark:bg-gray-700'} ${ labelClassName ?? 'peer-focus:dark:bg-gray-700 px-2 pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:bg-white peer-focus:scale-[0.8] peer-focus:text-sky-700 peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-sky-700'}`}
        >{label}
        </label>
        <MdArrowDropDown className="absolute dark:text-gray-300 right-4 top-1/4 text-xl" />
      </div>
      {open && <div className="absolute w-full top-full z-50">
        <div className={`${open ? 'opacity-1 scale-full' : 'scale-[0.8] opacity-0'} h-22 relative outline-none min-w-[100px] m-0 bg-white shadow-[0_2px_5px_0_rgba(0,0,0,0.16),_0_2px_10px_0_rgba(0,0,0,0.12)] transition duration-200 motion-reduce:transition-none dark:bg-gray-800`}>
          <div className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-button]:block [&::-webkit-scrollbar-button]:h-0 [&::-webkit-scrollbar-button]:bg-transparent [&::-webkit-scrollbar-track-piece]:bg-transparent [&::-webkit-scrollbar-track-piece]:rounded-none [&::-webkit-scrollbar-track-piece]: [&::-webkit-scrollbar-track-piece]:rounded-l [&::-webkit-scrollbar-thumb]:h-[50px] [&::-webkit-scrollbar-thumb]:bg-[#999] [&::-webkit-scrollbar-thumb]:rounded">
            {
              multiple ? <Option multiple={multiple} onClick={() => handleSelectAll()} item={selectAll} /> :
                <Option multiple={multiple} onClick={() => handleDeselect()} item={{ selected: false, value: '.' }} textClass={'opacity-0'} />
            }
            {
              options.map((item, i) => {
                return <Option multiple={multiple} onClick={() => handleClick(item.value)} item={item} key={i} />;
              })
            }
          </div>
        </div>
      </div>}
    </div>
  );
}