import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import { useMap } from "react-leaflet";
import * as L from "leaflet";

export function CleanMapButton() {
  const map = useMap();
  const clean = () => {
    const layers: L.Layer[] = L.PM.Utils.findLayers(map);
    if (layers.length === 0) {
      //...
      alert("Error. No hi ha elements al mapa per netejar!");
    } else {
      layers.forEach((layer: L.Layer) => {
        map.removeLayer(layer);
      });
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
