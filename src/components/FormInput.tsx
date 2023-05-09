type InputChangeType<T extends string | number | readonly string[] | undefined> =
  T extends string ? string :
  T extends number ? number :
  never;

type FormInputProps<T extends string | number | readonly string[] | undefined> = {
  label: string;
  value?: T;
  id: string;
  type: HTMLInputElement['type'];
  placeHolder?: string;
  onChange: (val: InputChangeType<T>) => void;
  wrapperClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  required?: boolean;
};

export default function FormInput<T extends string | number | readonly string[] | undefined>({ label, value = '', id, type = 'text', placeHolder = '', onChange, wrapperClassName, inputClassName, labelClassName, required }: FormInputProps<T>){
  return (
    <div className={wrapperClassName ?? 'relative mb-3 w-3/4'}>
      <input
        type={type}
        id={id}
        onChange={e => onChange(e.target.value as InputChangeType<T>)}
        value={value}
        className={inputClassName ?? 'peer focus:border-sky-700 focus:border-2 block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-sky-700 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-sky-700 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0'}
        placeholder={placeHolder}
        autoComplete="new-password"
        required={required}
      />
      <label
        htmlFor={id}
        className={`${value && '-translate-y-[0.9rem] scale-[0.8] text-sky-700 bg-white dark:bg-gray-700'} ${ labelClassName ?? 'peer-focus:dark:bg-gray-700 px-2 pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:bg-white peer-focus:scale-[0.8] peer-focus:text-sky-700 peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-sky-700'}`}
      >{label}
      </label>
    </div>
  );
}