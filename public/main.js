import { mapData } from "./mapData.js";

/* ---------- Map setup ---------- */

const map = L.map("map").setView([46.5, 2.5], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

/* ---------- Chapter colours ---------- */

const chapterColours = {
  5: "#8B0000",
  6: "#B22222",
  7: "#DC143C",
  8: "#FF8C00",
  9: "#FFA500",
  10: "#FFD700",
  11: "#9ACD32",
  12: "#228B22",
  16: "#1E90FF",
  17: "#4169E1",
  18: "#4B0082"
};

/* ---------- Marker layer ---------- */

const geoLayer = L.geoJSON(mapData, {
  pointToLayer: (feature, latlng) => {
    const chapter = feature.properties.chapter;
    const order = feature.properties.order;
    const duplicate = feature.properties.duplicate;

    // Offset duplicate markers to prevent overlapping
    let adjustedLatlng = latlng;
    if (duplicate) {
      // Offset by ~0.01 degrees per duplicate (roughly 1km)
      const offset = 0.01 * (duplicate - 1);
      adjustedLatlng = L.latLng(
        latlng.lat + offset,
        latlng.lng + offset
      );
    }

    const icon = L.divIcon({
      className: "numbered-icon",
      html: `
        <div style="
          background:${chapterColours[chapter] || "#000"};
          width:24px;
          height:24px;
          border-radius:50%;
          color:white;
          font-size:12px;
          line-height:24px;
          text-align:center;
          font-weight:bold;
        ">
          ${order}
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    return L.marker(adjustedLatlng, { icon });
  },

  onEachFeature: (feature, layer) => {
    const { place, chapter, event, confidence, duplicate, order } = feature.properties;

    layer.bindPopup(`
      <strong>${place}</strong> ${duplicate ? `(Visit #${duplicate})` : ""}<br>
      Step ${order} • Chapter ${chapter}<br>
      ${event || ""}<br>
      <em>Confidence: ${confidence || "unknown"}</em>
    `);
  }
}).addTo(map);

/* ---------- Connect points with lines ---------- */

// Sort features by order to connect them sequentially
const sortedFeatures = [...mapData.features].sort((a, b) => {
  return a.properties.order - b.properties.order;
});

// Create line coordinates
const lineCoordinates = sortedFeatures.map(feature => {
  const latlng = L.latLng(
    feature.geometry.coordinates[1],
    feature.geometry.coordinates[0]
  );

  // Apply same offset as markers for duplicates
  const duplicate = feature.properties.duplicate;
  if (duplicate) {
    const offset = 0.01 * (duplicate - 1);
    return [latlng.lat + offset, latlng.lng + offset];
  }

  return [latlng.lat, latlng.lng];
});

// Draw the polyline
const journeyLine = L.polyline(lineCoordinates, {
  color: '#333',
  weight: 2,
  opacity: 0.6,
  dashArray: '5, 10'
}).addTo(map);

/* ---------- Fit map to data ---------- */

map.fitBounds(geoLayer.getBounds(), { padding: [20, 20] });

/* ---------- Legend ---------- */

const legend = L.control({ position: "bottomright" });

legend.onAdd = () => {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML = "<strong>Chapters</strong><br>";

  Object.keys(chapterColours).forEach(ch => {
    div.innerHTML += `
      <span style="
        display:inline-block;
        width:10px;
        height:10px;
        background:${chapterColours[ch]};
        margin-right:6px;
      "></span>
      Chapter ${ch}<br>
    `;
  });

  return div;
};

legend.addTo(map);

