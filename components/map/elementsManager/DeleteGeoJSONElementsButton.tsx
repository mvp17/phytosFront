import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMap } from "react-leaflet";

export function DeleteGeoJSONElementsButton() {
  const map = useMap();
  const deleteElements = () => {
    console.log(map.getCenter());
  };

  return (
    <Tooltip title="Delete data">
      <Button onClick={deleteElements}>
        <DeleteIcon />
      </Button>
    </Tooltip>
  );
}
