import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import { usePolygonsStore } from "../stores/PolygonsStore";
import { useMapDataStore } from "../stores/MapDataStore";


export function CleanMapButton() {
  const setIdForMarkers = useMapDataStore((state) => state.setIdForMarkers);
  const setTotalAreaPolygons = useMapDataStore((state) => state.setTotalAreaPolygons);
  const setTotalAreaPolygonsString = useMapDataStore((state) => state.setTotalAreaPolygonsString);
  const setTotalProducts = useMapDataStore((state) => state.setTotalProducts);
  const setMarkedProducts = useMapDataStore((state) => state.setMarkedProducts);
  
  const map = useMap();
  const resetPolygons = usePolygonsStore((state) => state.resetPolygons);
  const clean = () => {
    const layers: L.Layer[] = L.PM.Utils.findLayers(map);
    if (layers.length === 0) {
      resetPolygons();
      setTotalAreaPolygons(0);
      setTotalProducts(0);
      setMarkedProducts(0);
      setIdForMarkers(0);
      setTotalAreaPolygonsString("0");
      alert("Error. No hi ha elements al mapa per netejar!");
    } else {
      layers.forEach((layer: L.Layer) => {
        map.removeLayer(layer);
      });
      resetPolygons();
      setTotalAreaPolygons(0);
      setTotalProducts(0);
      setMarkedProducts(0);
      setIdForMarkers(0);
      setTotalAreaPolygonsString("0");
    }
  };

  return (
    <Tooltip title="Clean map elements">
      <Button onClick={clean}>
        <CleaningServicesIcon />
      </Button>
    </Tooltip>
  );
}
