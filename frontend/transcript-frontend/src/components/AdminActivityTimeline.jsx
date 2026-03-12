import { useEffect, useState } from "react";
import axios from "../api/axios";
import { CheckCircle, AlertTriangle, FileText, UserPlus, Download } from "lucide-react";

const AdminActivityTimeline = () => {

  const [activities, setActivities] = useState([]);

  const fetchActivity = async () => {
    try {
      const res = await axios.get("/api/v1/activity");
      setActivities(res.data);
    } catch (err) {
      console.error("Failed to load activity logs", err);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const getIcon = (action) => {

    if (action === "VERIFY_TRANSCRIPT")
      return <CheckCircle className="text-green-600" size={20} />;

    if (action === "DELETE_TRANSCRIPT")
      return <AlertTriangle className="text-red-600" size={20} />;

    if (action === "DOWNLOAD_TRANSCRIPT")
      return <Download className="text-blue-600" size={20} />;

    if (action === "CREATE_STUDENT")
      return <UserPlus className="text-purple-600" size={20} />;

    return <FileText className="text-slate-600" size={20} />;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">

      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Recent Admin Activity
      </h2>

      <div className="space-y-4">

        {activities.slice(0,6).map((a) => (

          <div
            key={a.id}
            className="flex gap-3 items-start border-b pb-3"
          >

            <div className="mt-1">
              {getIcon(a.action)}
            </div>

            <div className="flex flex-col">

              <p className="text-sm text-slate-700">
                {a.description}
              </p>

              <p className="text-xs text-slate-400">
                {new Date(a.timestamp).toLocaleString()}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default AdminActivityTimeline;