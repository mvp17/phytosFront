import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { useMap } from "react-leaflet";

export function DownloadReportButton() {
  const map = useMap();
  const download = () => {
    console.log(map.getCenter());
  };

  return (
    <Tooltip title="Download report">
      <Button onClick={download}>
        <SummarizeIcon />
      </Button>
    </Tooltip>
  );
}
