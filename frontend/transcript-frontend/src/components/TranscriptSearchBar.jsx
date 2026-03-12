import { Search, X, Filter } from "lucide-react";
import {useRef} from "react";
const TranscriptSearchBar = ({
  searchInput,
  setSearchInput,
  totalCount,
  filterStatus,
  setFilterStatus,
  onSearch
}) => {
    const filterRef = useRef(null);
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between">

      <div className="flex items-center gap-4">

        <div className="relative w-80">

          <Search
            size={18}
            onClick={onSearch}
            className="absolute left-3 top-3 text-slate-400 cursor-pointer hover:text-blue-700 z-10"
          />
          <input
            type="text"
            placeholder="Search transcripts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            className="w-full pl-10 pr-10 py-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-800 focus:outline-none"
          />

          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                onSearch();
              }}
              className="absolute right-3 top-3 text-slate-400 hover:text-red-500"
            >
              <X size={18} />
            </button>
          )}

        </div>

      </div>

      <div className="flex items-center gap-6">

        <div className="text-sm text-slate-500">
          Total: <span className="font-semibold text-slate-800">{totalCount}</span>
        </div>

        <div className="relative flex items-center border border-slate-200 rounded-xl px-3 py-2 hover:border-blue-500 focus-within:ring-2 focus-within:ring-blue-800">

          <Filter size={16} className="text-slate-500 mr-2" />

          <select
            ref={filterRef}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-transparent pr-6 outline-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
            <option value="TAMPERED">Tampered</option>
          </select>

        </div>
        </div>
      </div>
  );
};

export default TranscriptSearchBar;