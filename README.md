# The Longest Walk Home: Interactive Map

This project documents Ray Bailey's incredible 2,000-mile escape across Europe during WWII, as recounted in David Wilkins' book *The Longest Walk Home*.

Built with **Leaflet.js**, **Milligram CSS**, and **OpenStreetMap** data.

---

## 🚀 Run Locally

Since the project uses ES Modules, you must serve the files through a local web server.

1.  Open your terminal in the project folder.
2.  Start the server:
    ```bash
    npx serve .
    ```
3.  Open the provided URL (usually `http://localhost:3000`) in your browser.

---

## 🗺️ How the Data Works

The map's "source of truth" is `data/data.geojson`. 

1. **Order is Inferred**: The markers and the journey line are generated based on the **array order** in the GeoJSON file. The first item in the file is Step 1, the second is Step 2, etc.
2. **Automated Coordinates**: The coordinates can be fetched via a Ruby script to avoid manual lat/lng entry.

---

## 📍 Adding a New Location

To add a new stop on Ray's journey, follow these steps in order:

### 1. Update the GeoJSON
Open `data/data.geojson` and add a new Feature object to the desired position of the `features` array. Leave the coordinates as `[null, null]`.

```json
{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [null, null] },
  "properties": {
    "place": "Yvetot",
    "chapter": 6,
    "event": "Signpost observed"
  }
}
```

### 2. Populate Coordinates (Ruby)
Run the geocoding script to look up the Latitude and Longitude via the OpenStreetMap API.

```bash
ruby geocode.rb # this only makes an API call for each feature with null coordinates, so it's safe to run multiple times as you add new locations.
```
*Note: This script includes a 1.1s delay between requests to respect API rate limits.*

### 3. Refresh
Refresh your browser to see the new point and the updated journey line.
