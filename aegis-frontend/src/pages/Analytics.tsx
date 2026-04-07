import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import "../styles/Analytics.css";

const COLORS = ["#00e0ff", "#ff6b6b", "#feca57", "#5f27cd"];

export default function Analytics() {

  const [detections, setDetections] = useState<any[]>([]);
  const [latency, setLatency] = useState<any[]>([]);
  const [systemLoad, setSystemLoad] = useState<any[]>([]);

  const cameraActivity = [
    { camera: "Cam 1", detections: 12 },
    { camera: "Cam 2", detections: 21 },
    { camera: "Cam 3", detections: 9 }
  ];

  const alertDistribution = [
    { name: "Person Found", value: 7 },
    { name: "System Error", value: 2 },
    { name: "Connection Error", value: 1 },
    { name: "Processing Error", value: 2 }
  ];

  const cameraUptime = [
    { camera: "Cam 1", uptime: 98 },
    { camera: "Cam 2", uptime: 94 },
    { camera: "Cam 3", uptime: 90 }
  ];

  const confidenceData = [
    { level: "90-100%", value: 15 },
    { level: "70-90%", value: 10 },
    { level: "50-70%", value: 4 }
  ];

  const networkLatency = [
    { camera: "Cam 1", latency: 80 },
    { camera: "Cam 2", latency: 120 },
    { camera: "Cam 3", latency: 95 }
  ];

  useEffect(() => {

    const interval = setInterval(() => {

      const time = new Date().toLocaleTimeString();

      setDetections(prev => [
        ...prev.slice(-10),
        { time, value: Math.floor(Math.random() * 6) }
      ]);

      setLatency(prev => [
        ...prev.slice(-10),
        { time, value: 80 + Math.random() * 100 }
      ]);

      setSystemLoad(prev => [
        ...prev.slice(-10),
        {
          time,
          cpu: Math.random() * 100,
          gpu: Math.random() * 100
        }
      ]);

    }, 3000);

    return () => clearInterval(interval);

  }, []);

  return (

   <div className="analytics">

  <h1>System Analytics</h1>

  <div className="analytics-grid">

    {/* LARGE CHART */}
    <div className="chart-card large">
      <h3>Detection Rate</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={detections}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line dataKey="value" stroke="#00e0ff" />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* LARGE CHART */}
    <div className="chart-card large">
      <h3>System Resource Usage</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={systemLoad}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area dataKey="cpu" fill="#ff6b6b" stroke="#ff6b6b"/>
          <Area dataKey="gpu" fill="#00e0ff" stroke="#00e0ff"/>
        </AreaChart>
      </ResponsiveContainer>
    </div>

    {/* CAMERA GROUP */}
    <div className="chart-card medium">
      <h3>Camera Activity</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={cameraActivity}>
          <XAxis dataKey="camera" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="detections" fill="#00e0ff"/>
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="chart-card medium">
      <h3>Camera Uptime</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={cameraUptime}>
          <XAxis dataKey="camera" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="uptime" fill="#2ed573"/>
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="chart-card medium">
      <h3>Camera Network Latency</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={networkLatency}>
          <XAxis dataKey="camera" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="latency" fill="#feca57"/>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* AI METRICS */}
    <div className="chart-card medium">
      <h3>Detection Confidence</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={confidenceData}>
          <XAxis dataKey="level" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#00e0ff"/>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* FULL WIDTH */}
    <div className="chart-card wide">
      <h3>Alert Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={alertDistribution} dataKey="value" outerRadius={100}>
            {alertDistribution.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

  </div>

</div>
  );
}

function ChartCard({ title, children }: any) {

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      {children}
    </div>
  );

}