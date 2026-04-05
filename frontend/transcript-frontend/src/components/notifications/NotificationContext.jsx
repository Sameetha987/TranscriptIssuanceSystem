import { createContext, useContext, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {

  const [notifications, setNotifications] = useState([]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showNotification = (type, message) => {

    const id = Date.now();

    const newNotification = { id, type, message };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after 4s
    setTimeout(() => removeNotification(id), 4000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>

      {children}

      {/* 🔔 TOAST CONTAINER */}
      <div className="fixed top-5 right-5 space-y-3 z-50">

        {notifications.map((n) => (
          <Toast key={n.id} {...n} onClose={() => removeNotification(n.id)} />
        ))}

      </div>

    </NotificationContext.Provider>
  );
};

const Toast = ({ type, message, onClose }) => {

  const styles = {
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    info: "bg-indigo-50 border-indigo-200 text-indigo-700"
  };

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-md
      backdrop-blur-md ${styles[type]} animate-slideIn`}>

      {icons[type]}

      <p className="text-sm font-medium">{message}</p>

      <button onClick={onClose} className="ml-auto">
        <X size={16} />
      </button>

    </div>
  );
};