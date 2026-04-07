import { useState, useRef, useEffect } from "react";
import "../styles/Dashboard.css";

import { requestNotificationPermission, messaging, onMessage } from "../firebase";
import type { SearchResult, FaceMatch } from "../types";

const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL;

export default function Dashboard() {

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifEnabled, setNotifEnabled] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  /* ======================
     NOTIFICATIONS
  ====================== */

  useEffect(() => {

    requestNotificationPermission().then(token => {
      if (token) setNotifEnabled(true);
    });

    onMessage(messaging, (payload) => {
      alert(`🚨 ${payload.notification?.title}\n${payload.notification?.body}`);
    });

  }, []);

  /* ======================
     IMAGE UPLOAD
  ====================== */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);

  };

  /* ======================
     SEARCH
  ====================== */

  const handleSearch = async () => {

    if (!image) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {

      const formData = new FormData();
      formData.append("file", image);

      const res = await fetch(`${FASTAPI_URL}/search`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Search failed");
      }

      const data: SearchResult = await res.json();
      setResult(data);

    } catch (err: any) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };

  /* ======================
     UI
  ====================== */

  return (

    <div className="dashboard">

      <div className="dashboard-header">

        <h1>Surveillance Dashboard</h1>

        <span className={notifEnabled ? "notif-on" : "notif-off"}>
          {notifEnabled ? "🔔 Live Alerts" : "🔕 Alerts Off"}
        </span>

      </div>

      <div className="dashboard-grid">

        {/* LEFT: UPLOAD */}

        <div className="card upload-card">

          <h3>Target Face Input</h3>

          <div
            className="upload-box"
            onClick={() => fileRef.current?.click()}
          >

            {preview ? (
              <img src={preview} alt="preview" />
            ) : (
              <p>Click to upload face image</p>
            )}

          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />

          <button
            onClick={handleSearch}
            disabled={!image || loading}
            className="search-btn"
          >
            {loading ? "Scanning..." : "Start Detection"}
          </button>

        </div>

        {/* RIGHT: RESULTS */}

        <div className="card result-card">

          <h3>Detection Results</h3>

          {error && <div className="error">{error}</div>}

          {!result && !loading && (
            <p className="placeholder">
              AI results will appear here
            </p>
          )}

          {result && (

            result.found ? (

              <>
                <h4 className="success">MATCH FOUND</h4>

                {result.matches.map((match: FaceMatch, i: number) => (

                  <div key={i} className="match-card">

                    <div className="similarity">

                      <span>Similarity</span>
                      <span>{match.similarity_percent}%</span>

                    </div>

                    <div className="bar">
                      <div
                        className="fill"
                        style={{ width: `${match.similarity_percent}%` }}
                      />
                    </div>

                    <div className="meta">

                      {match.metadata.location && <p>📍 {match.metadata.location}</p>}
                      {match.metadata.timestamp && <p>🕐 {match.metadata.timestamp}</p>}
                      {match.metadata.device_id && <p>📷 {match.metadata.device_id}</p>}

                    </div>

                  </div>

                ))}

              </>

            ) : (

              <div className="no-match">
                No Match Found
              </div>

            )

          )}

        </div>

      </div>

    </div>

  );
}