interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onMenuToggle?: () => void;
  className?: string;
}

export default function SearchBar({ value, onChange, onMenuToggle, className = '' }: SearchBarProps) {
  return (
    <div className={`flex flex-1 min-w-[260px] max-w-full items-center gap-2 rounded-2xl border border-[#E6E6E6] bg-white px-3 py-2 shadow-sm ${className}`}>
      <button
        onClick={onMenuToggle}
        className="shrink-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F7F7F7] text-[#616161] transition hover:bg-[#F3F4F6]"
        aria-label="Mostrar filtros"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M6 12h12M10 19.5h4" />
        </svg>
      </button>

      <input
        type="text"
        placeholder="Buscar Unidad"
        className="flex-1 bg-transparent outline-none border-none text-sm placeholder-[#616161]"
        style={{ color: '#1E1E1E' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar unidad de la flota"
      />

      <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F7F7F7] text-[#616161]">
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}
