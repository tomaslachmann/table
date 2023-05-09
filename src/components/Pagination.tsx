type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
};

type PaginationButtonProps = {
  page: number;
  active?: boolean;
  disabled?: boolean;
  onPageChange: (pageNumber: number) => void;
  currentPage: number;
  type?: string;
  label: string;
};

function PaginationButton({ page, active = false, disabled = false, onPageChange, type = 'main', currentPage, label }: PaginationButtonProps){
  return(
    <li>
      <button
        className={`relative block px-3 py-1.5 transition-all duration-300 rounded
          ${type === 'main' ? active ? 'dark:bg-sky-600 dark:text-gray-300 hidden md:inline-block text-sm font-medium bg-sky-100 text-sky-700'
      : 'hidden md:inline-block bg-transparent text-sm text-neutral-600 hover:bg-neutral-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200' :
      disabled ? 'pointer-events-none bg-transparent text-sm text-neutral-500 dark:text-neutral-400' :
        'bg-transparent text-sm text-neutral-600 hover:bg-neutral-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200'}`}
        disabled={disabled && type !== 'main'}
        onClick={() => {
          type === 'main' && onPageChange(page);
          type === 'first' && onPageChange(currentPage - 1);
          type === 'last' && onPageChange(currentPage + 1);
        }}>
        {
          type === 'main' ? active ? <span className="overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">{ label }</span> : label : label
        }
      </button>
    </li>
  );
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Page navigation example">
      <ul className="list-style-none mb-6 flex">
        <PaginationButton label='Prev' page={currentPage} onPageChange={onPageChange} currentPage={currentPage} type='first' disabled={currentPage <= 1} />
        {pages.map((page, i) => (
          <PaginationButton key={page} label={page.toString()} page={page} onPageChange={onPageChange} currentPage={currentPage} active={currentPage - 1 === i} />
        ))}
        <PaginationButton label='Next' page={currentPage} onPageChange={onPageChange} currentPage={currentPage} type='last' disabled={currentPage >= totalPages} />
      </ul>
    </nav>
  );
}
