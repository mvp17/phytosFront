import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useMap } from "react-leaflet";

export function LoadGeoJSONElementsButton() {
  const map = useMap();
  const load = () => {
    console.log(map.getCenter());
  };

  return (
    <Tooltip title="Load data">
      <Button onClick={load}>
        <CloudDownloadIcon />
      </Button>
    </Tooltip>
  );
}
