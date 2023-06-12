import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import { Dispatch, SetStateAction } from "react";
import AreThereAnyMarkers from "../utils/AreThereAnyMarkers";

type Dispatcher = Dispatch<SetStateAction<boolean>>;

interface IProps {
  actionRadius: boolean;
  setActionRadius: Dispatcher;
  productDensity: number;
  productColor: string;
  hiddenMarkersByDraggingCircles: Map<string, number[]>;
}

const SeeProductActionRadiusButton = ({
  actionRadius,
  setActionRadius,
  productDensity,
  productColor,
  hiddenMarkersByDraggingCircles
}: IProps) => {
  const map = useMap();
  const radiation = () => {
    const layers: L.Layer[] = L.PM.Utils.findLayers(map);
    if (
      window.confirm(
        "OK: Activar radi d'actuació.\nCancel: Desactivar radi d'actuació."
      )
    ) {
      // S'activa el radi
      if (!actionRadius) {
        setActionRadius(true); //this.actionRadius = true;
        if (AreThereAnyMarkers(layers)) {
          layers.forEach((layer: L.Layer) => {
            if (layer instanceof L.Marker) {
              const area: number = (1 / productDensity) * 10000;
              let radius: number = Math.sqrt(area / Math.PI);
              radius = Math.ceil(radius);
              //console.log("El radi d'acció del producte utilitzat és: ", radius);
              const circle: L.Circle = L.circle(layer.getLatLng(), {
                fillColor: productColor,
                color: "#000000"
              }).setRadius(radius);
              const layerContent = layer!.getPopup()!.getContent();
              if (layerContent) circle.bindTooltip(layerContent);

              circle.addTo(map);
              circle.on("pm:dragstart", () => {
                const layers: L.Layer[] = L.PM.Utils.findLayers(map);
                layers.forEach((layer: L.Layer) => {
                  const circleContent = circle!.getTooltip()!.getContent();
                  if (
                    layer instanceof L.Marker &&
                    layerContent === circleContent
                  ) {
                    map.removeLayer(layer);
                  }
                });
              });
              circle.on("pm:dragend", () => {
                hiddenMarkersByDraggingCircles.set(layerContent!.toString(), [
                  circle.getLatLng().lat,
                  circle.getLatLng().lng
                ]);
              });
              circle.on("click", () => {
                circle.setStyle({ fillColor: "#ffffff", color: "#ffffff" });
              });
            }
          });
        }
      }
    } else {
      // es desactiva el radi
      if (actionRadius) {
        setActionRadius(false); // this.actionRadius = false;
        layers.forEach((layer: L.Layer) => {
          if (layer instanceof L.Circle) map.removeLayer(layer);
        });
        hiddenMarkersByDraggingCircles.forEach(
          (coordinates: number[], markerId: string) => {
            const latLng: L.LatLng = L.latLng(coordinates[0], coordinates[1]);
            map.addLayer(
              L.marker(latLng)
                .setIcon(
                  L.divIcon({
                    html:
                      "&nbsp;&nbsp;&nbsp;&nbsp;" +
                      '<b class="strokeme">' +
                      markerId +
                      "</b>"
                  })
                )
                .bindPopup(markerId)
            );
          }
        );
        hiddenMarkersByDraggingCircles.clear();
      }
    }
  };

  return (
    <Tooltip title="Action radius">
      <Button onClick={radiation}>
        <TrackChangesIcon />
      </Button>
    </Tooltip>
  );
};

export default SeeProductActionRadiusButton;
