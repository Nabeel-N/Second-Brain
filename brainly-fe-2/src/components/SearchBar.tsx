import SearchIcon from "../SearchIcon";

interface SearchBarProps {
  onChange: (value: string) => void;
  value: string;
}

export function SearchBar({ onChange, value }: SearchBarProps) {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="relative w-full max-w-md md:w-auto">
            
        {/* Search Input */}
        <input
          type="text"
          className="w-full bg-white/70 backdrop-blur-lg text-gray-900 p-3 pl-12 border border-gray-300 rounded-full shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500"
          placeholder="Search"
          onChange={(e) => onChange(e.target.value)}
        />

        {/* Search Icon - Positioned Inside the Input */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <SearchIcon />
        </div>
      </div>
    </div>
  );
}
