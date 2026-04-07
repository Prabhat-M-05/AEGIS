import { createContext, useContext, useState } from "react";

interface Alert {
  id: number;
  type: string;
  message: string;
  time: string;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  newAlert: boolean;
  clearAlertIndicator: () => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const AlertProvider = ({ children }: any) => {

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newAlert, setNewAlert] = useState(false);

  const addAlert = (alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
    setNewAlert(true);
  };

  const clearAlertIndicator = () => {
    setNewAlert(false);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        addAlert,
        newAlert,
        clearAlertIndicator
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used inside AlertProvider");
  return context;
};