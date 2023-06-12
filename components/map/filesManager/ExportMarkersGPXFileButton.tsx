import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useMap } from "react-leaflet";

export function ExportMarkersGPXFileButton() {
  const map = useMap();
  const exportGPX = () => {
    console.log(map.getCenter());
  };

  return (
    <Tooltip title="Export GPX">
      <Button onClick={exportGPX}>
        <FileDownloadIcon />
      </Button>
    </Tooltip>
  );
}
