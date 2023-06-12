import { FeatureGroup } from "react-leaflet";
import { GeomanControls } from "react-leaflet-geoman-v2";

export default function Geoman() {
  const handleChange = () => {
    console.log("Event fired!");
  };

  const onCreate = (e: { shape: string; layer: L.Layer }) => {};

  const onRemove = (e: { shape: string; layer: L.Layer }) => {
    console.log(e.layer);
  };

  return (
    <FeatureGroup>
      <GeomanControls
        options={{
          position: "topright",
          drawText: false
        }}
        globalOptions={{
          continueDrawing: true,
          editable: false
        }}
        onCreate={(e) => onCreate(e)}
        onChange={handleChange}
        onUpdate={handleChange}
        onEdit={handleChange}
        onMapRemove={(e) => onRemove(e)}
        onMapCut={handleChange}
        onDragEnd={handleChange}
        onMarkerDragEnd={handleChange}
      />
    </FeatureGroup>
  );
}
