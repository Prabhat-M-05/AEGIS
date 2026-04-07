import { MapContainer, TileLayer, Circle, Tooltip } from "react-leaflet";
import { useState, useEffect } from "react";

const cameras = [
  { id: "cam1", name: "C1", lat: 12.9716, lng: 77.5906 },
  { id: "cam2", name: "C2", lat: 12.9745, lng: 77.6125 },
  { id: "cam3", name: "C3", lat: 12.9590, lng: 77.5995 }
];
const TacticalMap = () => {

  const [activeCamera, setActiveCamera] = useState<string | null>(null);
  const [pulse, setPulse] = useState(50);

  const triggerDetection = (id: string) => {
    setActiveCamera(id);
    setPulse(50);
  };

  useEffect(() => {

    if (!activeCamera) return;

    const interval = setInterval(() => {
      setPulse((p) => {
        if (p > 400) return 50;
        return p + 20;
      });
    }, 120);

    return () => clearInterval(interval);

  }, [activeCamera]);

  return (
    <div>

      <button onClick={() => triggerDetection("cam2")}>
        Simulate Detection
      </button>

      <MapContainer
        center={[12.9716, 77.5980]}
        zoom={14}
        style={{ height: "500px", width: "100%" }}
      >

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {cameras.map((cam) => {

          const isActive = activeCamera === cam.id;

          return (
            <div key={cam.id}>

              {/* Camera marker */}
             <Circle
  center={[cam.lat, cam.lng]}
  radius={20}
  pathOptions={{
    color: activeCamera === cam.id ? "#ff3b3b" : "#00e0ff",
    fillOpacity: 1
  }}
>
  <Tooltip
    permanent
    direction="top"
    offset={[0, -10]}
    className={activeCamera === cam.id ? "camera-active" : "camera-inactive"}
  >
    {cam.name}
  </Tooltip>
</Circle>

              {isActive && (
                <>
                  <Circle
                    center={[cam.lat, cam.lng]}
                    radius={pulse}
                    pathOptions={{
                      color: "#00e0ff",
                      weight: 2,
                      opacity: 0.6,
                      fillOpacity: 0
                    }}
                  />

                  <Circle
                    center={[cam.lat, cam.lng]}
                    radius={pulse + 120}
                    pathOptions={{
                      color: "#00e0ff",
                      weight: 2,
                      opacity: 0.4,
                      fillOpacity: 0
                    }}
                  />

                  <Circle
                    center={[cam.lat, cam.lng]}
                    radius={pulse + 240}
                    pathOptions={{
                      color: "#00e0ff",
                      weight: 2,
                      opacity: 0.2,
                      fillOpacity: 0
                    }}
                  />
                </>
              )}

            </div>
          );
        })}

      </MapContainer>

    </div>
  );
};

export default TacticalMap;