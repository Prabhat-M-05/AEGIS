import "./Navbar.css";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="navbar">

      <div className="brand">
        <span className="brand-name">AEGIS </span>
        <span className="brand-divider">| </span>
        <span className="brand-module"> Mission Control</span>
      </div>

      <div className="center-metrics">
        <div className="metric">
          <span className="metric-value">12</span>
          <span className="metric-label">Active Cameras</span>
        </div>

        <div className="metric">
          <span className="metric-value">03</span>
          <span className="metric-label">Live Alerts</span>
        </div>

        <div className="metric">
          <span className="metric-value">99.2%</span>
          <span className="metric-label">AI Accuracy</span>
        </div>
      </div>

      <div className="right-section">
        <div className="live-status">
          <span className="dot"></span>
          System Active
        </div>
        <div className="time">{time}</div>
      </div>

    </div>
  );
};

export default Navbar;