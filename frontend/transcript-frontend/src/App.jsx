import AppRoutes from './routes/AppRoutes';
import { NotificationProvider } from "./components/notifications/NotificationContext";

function App() {
  return (
    <>
      <NotificationProvider>
         <AppRoutes />
      </NotificationProvider>
    </>
  );
}

export default App;



