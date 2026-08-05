interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onMenuToggle?: () => void;
}

export default function SearchBar({ value, onChange, onMenuToggle }: SearchBarProps) {
  return (
    <div className="w-72 bg-white rounded-lg shadow-sm flex items-center" style={{ border: '1px solid #E6E6E6' }}>
      {/* Botón de menú */}
      <button
        onClick={onMenuToggle}
        className="shrink-0 w-10 h-10 flex items-center justify-center transition-colors cursor-pointer hover:bg-gray-50 rounded-l-lg"
        style={{ color: '#616161' }}
        aria-label="Menú de filtros"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Campo de entrada */}
      <input
        type="text"
        placeholder="Buscar Unidad"
        className="flex-1 bg-transparent outline-none border-none text-sm py-2.5 placeholder-[#616161]"
        style={{ color: '#1E1E1E' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar unidad de la flota"
      />

      {/* Icono de búsqueda */}
      <div className="shrink-0 w-10 h-10 flex items-center justify-center" style={{ color: '#616161' }}>
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}
