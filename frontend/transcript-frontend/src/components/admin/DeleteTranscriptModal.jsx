const DeleteTranscriptModal = ({ deleteId, setDeleteId, handleDelete }) => {

  if (!deleteId) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-xl p-8 w-96 space-y-6">

        <h3 className="text-lg font-semibold text-slate-800">
          Archive Transcript?
        </h3>

        <p className="text-slate-500 text-sm">
          This transcript will be hidden from active records.
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={() => setDeleteId(null)}
            className="px-4 py-2 bg-slate-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              handleDelete(deleteId);
              setDeleteId(null);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Archive
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteTranscriptModal;