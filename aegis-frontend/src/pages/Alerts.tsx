import { useState, useEffect, useRef } from "react";
import "../styles/Alerts.css";
import { useAlert } from "../context/AlertContext";

interface Alert {
  id: number;
  type: string;
  message: string;
  time: string;
}

export default function Alerts() {
const { triggerAlert, clearAlert } = useAlert();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [muted, setMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {

    audioRef.current = new Audio("/alert.mp3");

    const types = [
      "PERSON_FOUND",
      "SYSTEM_ERROR",
      "PROCESSING_ERROR",
      "SERVER_ERROR",
      "CLOUD_ERROR",
      "CONNECTION_ERROR"
    ];

    const messages = {
      PERSON_FOUND: "Target match detected at Camera 2",
      SYSTEM_ERROR: "GPU processing overload",
      PROCESSING_ERROR: "Face vector extraction failed",
      SERVER_ERROR: "Backend API not responding",
      CLOUD_ERROR: "Cloud vector DB unreachable",
      CONNECTION_ERROR: "Camera stream disconnected"
    };

    const interval = setInterval(() => {

      const type = types[Math.floor(Math.random() * types.length)];

      const newAlert: Alert = {
        id: Date.now(),
        type,
        message: messages[type as keyof typeof messages],
        time: new Date().toLocaleTimeString()
      };

setAlerts(prev => [newAlert, ...prev]);
triggerAlert();
useEffect(() => {
  clearAlert();
}, []);

      // play sound only for important alerts
      if (!muted && type === "PERSON_FOUND") {
        audioRef.current?.play();
      }

    }, 6000);

    return () => clearInterval(interval);

  }, [muted]);

  const filterAlerts = (type: string) => {
    return alerts.filter(a => a.type === type);
  };

  return (

    <div className="alerts-page">

      <div className="alerts-header">

        <h1>Alerts Monitor</h1>

        <button
          className="mute-btn"
          onClick={() => setMuted(!muted)}
        >
          {muted ? "Unmute Alerts 🔇" : "Mute Alerts 🔊"}
        </button>

      </div>

      <div className="alerts-grid">

        <AlertSection
          title="Person Found"
          alerts={filterAlerts("PERSON_FOUND")}
          color="cyan"
        />

        <AlertSection
          title="System Errors"
          alerts={filterAlerts("SYSTEM_ERROR")}
          color="orange"
        />

        <AlertSection
          title="Processing Errors"
          alerts={filterAlerts("PROCESSING_ERROR")}
          color="yellow"
        />

        <AlertSection
          title="Server Errors"
          alerts={filterAlerts("SERVER_ERROR")}
          color="red"
        />

        <AlertSection
          title="Cloud Errors"
          alerts={filterAlerts("CLOUD_ERROR")}
          color="purple"
        />

        <AlertSection
          title="Connection Errors"
          alerts={filterAlerts("CONNECTION_ERROR")}
          color="pink"
        />

      </div>

    </div>

  );
}

function AlertSection({ title, alerts, color }: any) {

  return (

    <div className={`alert-section ${color}`}>

      <h3>{title}</h3>

      <div className="alert-list">

        {alerts.length === 0 && (
          <p className="no-alert">No alerts</p>
        )}

        {alerts.map((alert: any) => (

          <div key={alert.id} className="alert-card">

            <p>{alert.message}</p>
            <span>{alert.time}</span>

          </div>

        ))}

      </div>

    </div>

  );
}