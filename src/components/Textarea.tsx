type TextareaProps = {
  _autoresize?: boolean;
  id: string;
  value?: string;
  onChange: (val: string) => void;
  label: string;
  required?: boolean;
};

export default function Textarea({ _autoresize = false, id, value = '', onChange, label, required = false }: TextareaProps){
  return(
    <div className="relative mb-3 w-3/4">
      <textarea
        id="body"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer focus:border-sky-700 border-2 focus:border-2 block min-h-[auto] w-full rounded bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-outline duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-sky-700 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-sky-700 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        required={required}
      ></textarea>
      <label
        htmlFor={id}
        className={`${value && '-translate-y-[0.9rem] scale-[0.8] text-sky-700 bg-white dark:bg-gray-700'} px-2 pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:bg-white peer-focus:dark:bg-gray-700 peer-focus:scale-[0.8] peer-focus:text-sky-700 peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-sky-700`}
      >{label}
      </label>
    </div>
  );
}