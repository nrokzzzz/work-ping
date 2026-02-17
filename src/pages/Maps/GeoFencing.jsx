import { useEffect, useRef, useState } from "react";

const GeoFencing = ({ onChange }) => {
  const mapRef = useRef(null);
  const polygonRef = useRef(null);
  const [coords, setCoords] = useState([]);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;
    const g = window.google;

    const map = new g.maps.Map(mapRef.current, {
      zoom: 15,
      center: { lat: 20.5937, lng: 78.9629 },
      mapTypeId: "roadmap",
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Map/Satellite toggle
    const typeDiv = document.createElement("div");
    typeDiv.style.background = "#fff";
    typeDiv.style.padding = "6px";
    typeDiv.style.borderRadius = "6px";
    typeDiv.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    typeDiv.style.display = "flex";
    typeDiv.style.gap = "6px";

    const mapBtn = document.createElement("button");
    mapBtn.innerText = "Map";
    mapBtn.className = "btn btn-sm btn-light";
    mapBtn.onclick = () => map.setMapTypeId("roadmap");

    const satBtn = document.createElement("button");
    satBtn.innerText = "Satellite";
    satBtn.className = "btn btn-sm btn-light";
    satBtn.onclick = () => map.setMapTypeId("satellite");

    typeDiv.appendChild(mapBtn);
    typeDiv.appendChild(satBtn);
    map.controls[g.maps.ControlPosition.BOTTOM_LEFT].push(typeDiv);

    // Live location marker
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        map.setCenter(loc);

        new g.maps.Marker({
          position: loc,
          map,
          icon: {
            path: g.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });
      });
    }

    // Drawing manager
    const drawing = new g.maps.drawing.DrawingManager({
      drawingMode: g.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [g.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        editable: true,
        fillColor: "#81c784",
        fillOpacity: 0.35,
        strokeColor: "#2e7d32",
        strokeWeight: 2,
      },
    });

    drawing.setMap(map);

    g.maps.event.addListener(drawing, "overlaycomplete", e => {
      if (polygonRef.current) polygonRef.current.setMap(null);

      const poly = e.overlay;
      polygonRef.current = poly;
      drawing.setDrawingMode(null);

      const path = poly.getPath();

      const updateCoords = () => {
        const arr = path.getArray().map(p => ({
          lat: p.lat(),
          lng: p.lng(),
        }));

        if (isSelfIntersecting(arr)) {
          alert("Polygon lines cannot overlap");
          poly.setMap(null);
          polygonRef.current = null;
          setCoords([]);
          onChange?.([]);
          return;
        }

        setCoords(arr);
        onChange?.(arr);
      };

      updateCoords();

      path.addListener("set_at", updateCoords);
      path.addListener("insert_at", updateCoords);

      poly.addListener("rightclick", ev => {
        if (ev.vertex != null) path.removeAt(ev.vertex);
      });
    });

    // Delete polygon button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete Polygon";
    delBtn.className = "btn btn-sm btn-danger";
    delBtn.style.margin = "10px";

    delBtn.onclick = () => {
      if (polygonRef.current) polygonRef.current.setMap(null);
      polygonRef.current = null;
      setCoords([]);
      onChange?.([]);
    };

    map.controls[g.maps.ControlPosition.TOP_CENTER].push(delBtn);

  }, []);

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div ref={mapRef} style={{ width: "70%", height: 420 }} />

      <div style={{
        width: "30%",
        border: "1px solid #ddd",
        padding: 10,
        borderRadius: 6,
        background: "#fafafa",
        overflowY: "auto"
      }}>
        <b>Polygon Coordinates</b>
        {coords.length === 0 && <p>No polygon drawn</p>}
        {coords.map((c, i) => (
          <div key={i}>
            {i + 1}. {c.lat.toFixed(6)}, {c.lng.toFixed(6)}
          </div>
        ))}
      </div>
    </div>
  );
};


// Self-intersection guard
function isSelfIntersecting(coords) {
  function intersect(a,b,c,d){
    const det=(b.lng-a.lng)*(d.lat-c.lat)-(b.lat-a.lat)*(d.lng-c.lng);
    if(det===0) return false;
    const t=((c.lng-a.lng)*(d.lat-c.lat)-(c.lat-a.lat)*(d.lng-c.lng))/det;
    const u=((c.lng-a.lng)*(b.lat-a.lat)-(c.lat-a.lat)*(b.lng-a.lng))/det;
    return t>0 && t<1 && u>0 && u<1;
  }

  for (let i=0;i<coords.length-1;i++){
    for (let j=i+2;j<coords.length-1;j++){
      if (intersect(coords[i],coords[i+1],coords[j],coords[j+1]))
        return true;
    }
  }
  return false;
}

export default GeoFencing;
