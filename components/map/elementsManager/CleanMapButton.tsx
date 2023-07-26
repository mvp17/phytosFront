import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import { useMap } from "react-leaflet";
import { Dispatch, SetStateAction } from "react";
import * as L from "leaflet";
import { usePolygonsStore } from "../stores/PolygonsStore";

type DispatcherNumber = Dispatch<SetStateAction<number>>;
type DispatcherString = Dispatch<SetStateAction<string>>;
interface IProps {
  props: {
    setIdForMarkers: DispatcherNumber;
    setTotalAreaPolygons: DispatcherNumber;
    setTotalProducts: DispatcherNumber;
    setMarkedProducts: DispatcherNumber;
    setTotalAreaPolygonsString: DispatcherString;
  };
}

export function CleanMapButton({ props }: IProps) {
  const map = useMap();
  const resetPolygons = usePolygonsStore((state) => state.resetPolygons);
  const clean = () => {
    const layers: L.Layer[] = L.PM.Utils.findLayers(map);
    if (layers.length === 0) {
      resetPolygons();
      props.setTotalAreaPolygons(0);
      props.setTotalProducts(0);
      props.setMarkedProducts(0);
      props.setIdForMarkers(0);
      props.setTotalAreaPolygonsString("0");
      alert("Error. No hi ha elements al mapa per netejar!");
    } else {
      layers.forEach((layer: L.Layer) => {
        map.removeLayer(layer);
      });
      resetPolygons();
      props.setTotalAreaPolygons(0);
      props.setTotalProducts(0);
      props.setMarkedProducts(0);
      props.setIdForMarkers(0);
      props.setTotalAreaPolygonsString("0");
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
