import { Search, X } from "lucide-react";

const TranscriptSearchBar = ({
  searchInput,
  setSearchInput,
  setSearch,
  totalCount,
  filterStatus,
  setFilterStatus
}) => {

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between">

      <div className="flex items-center gap-4">

        <div className="relative w-80">

          <Search className="absolute left-3 top-3 text-slate-400" size={18} />

          <input
            type="text"
            placeholder="Search transcripts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-800"
          />

          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setSearch("");
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

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-800"
        >
          <option value="All">All</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
          <option value="TAMPERED">Tampered</option>
        </select>

      </div>

    </div>
  );
};

export default TranscriptSearchBar;