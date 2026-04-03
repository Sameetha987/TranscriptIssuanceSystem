import { Search, X } from "lucide-react";

const SearchBar = ({
  id,
  setId,
  onSearch,
  loading
}) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 flex items-center gap-3 border">

      <Search className="text-slate-400" size={20} />

      <input
        type="number"
        placeholder="Enter Transcript ID..."
        value={id}
        onChange={(e) => setId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        className="flex-1 outline-none text-slate-700"
      />

      {id && !loading && (
        <button onClick={() => setId("")}>
          <X size={18} className="text-slate-400 hover:text-red-500" />
        </button>
      )}

      <button
        onClick={onSearch}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
      >
        {loading ? "..." : "Verify"}
      </button>

    </div>
  );
};

export default SearchBar;