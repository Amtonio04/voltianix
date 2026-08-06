interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onMenuToggle?: () => void;
  className?: string;
}

export default function SearchBar({ value, onChange, onMenuToggle, className = '' }: SearchBarProps) {
  return (
    <div className={`flex w-72 items-center rounded-lg border border-[#E6E6E6] bg-white shadow-sm ${className}`.trim()} style={{ border: '1px solid #E6E6E6' }}>
      <button
        onClick={onMenuToggle}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-l-lg transition-colors hover:bg-gray-50"
        style={{ color: '#616161' }}
        aria-label="Menú de filtros"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <input
        type="text"
        placeholder="Buscar Unidad"
        className="flex-1 border-none bg-transparent py-2.5 text-sm outline-none"
        style={{ color: '#1E1E1E' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar unidad de la flota"
      />

      <div className="flex h-10 w-10 shrink-0 items-center justify-center" style={{ color: '#616161' }}>
        <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}
