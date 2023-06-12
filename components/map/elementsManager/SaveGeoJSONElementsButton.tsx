import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useMap } from "react-leaflet";
import SaveIcon from "@mui/icons-material/Save";

export function SaveGeoJSONElementsButton() {
  const map = useMap();
  const save = () => {
    console.log(map.getCenter());
  };

  return (
    <Tooltip title="Save data">
      <Button onClick={save}>
        <SaveIcon />
      </Button>
    </Tooltip>
  );
}
