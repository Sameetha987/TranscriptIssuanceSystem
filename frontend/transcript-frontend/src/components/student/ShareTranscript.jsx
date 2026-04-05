import { Copy, ExternalLink, Share2 } from "lucide-react";
import { useNotification } from "../notifications/NotificationContext";

const ShareTranscript = ({ id }) => {

  const { showNotification } = useNotification();

  const publicUrl = `${window.location.origin}/verify?id=${id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      showNotification("success", "Link copied to clipboard");
    } catch {
      showNotification("error", "Failed to copy link");
    }
  };

  const handleOpen = () => {
    window.open(publicUrl, "_blank");
  };

  return (
    <div className="bg-white/80 border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">

      <div className="flex items-center gap-2 text-slate-700 font-semibold">
        <Share2 size={18} className="text-indigo-500" />
        Share Transcript
      </div>

      <div className="flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-2 text-sm overflow-hidden">
        <span className="truncate">{publicUrl}</span>
      </div>

      <div className="flex gap-3">

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          <Copy size={16} />
          Copy Link
        </button>

        <button
          onClick={handleOpen}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition"
        >
          <ExternalLink size={16} />
          Open
        </button>

      </div>

    </div>
  );
};

export default ShareTranscript;