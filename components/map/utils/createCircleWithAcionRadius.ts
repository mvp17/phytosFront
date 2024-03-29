import * as L from "leaflet";
import { useMap } from "react-leaflet";
import { useMapDataStore } from "../stores/MapDataStore";

export const createCircleWithActionRadius = (marker: L.Marker, productDensity: number, productColor: string) => {
  const map = useMap();
  const idForMarkers = useMapDataStore((state) => state.idForMarkers);
  const hiddenMarkersByDraggingCircles = useMapDataStore((state) => state.hiddenMarkersByDraggingCircles);


  marker.setIcon(
    L.divIcon({
      html: "&nbsp;&nbsp;&nbsp;&nbsp;" + idForMarkers.toString() + "</b>"
    })
  );

  marker.bindPopup(idForMarkers.toString());
  const area: number = (1 / productDensity) * 10000;
  let radius: number = Math.sqrt(area / Math.PI);
  radius = Math.ceil(radius);
  //console.log("El radi d'acció del producte utilitzat és: ", radius);
  const circle: L.Circle = L.circle(marker.getLatLng(), {
    fillColor: productColor,
    color: "#000000"
  }).setRadius(radius);
  circle.bindTooltip(idForMarkers.toString());
  circle.addTo(map);

  circle.on("pm:dragstart", (e) => {
    const layers: L.Layer[] = L.PM.Utils.findLayers(map);
    layers.forEach((layer: L.Layer) => {
      if (
        layer instanceof L.Marker &&
        layer.getPopup()!.getContent() === circle.getTooltip()!.getContent()
      ) {
        map.removeLayer(layer);
      }
    });
  });
  circle.on("pm:dragend", () => {
    hiddenMarkersByDraggingCircles.set(
      circle.getTooltip()!.getContent()!.toString(),
      [circle.getLatLng().lat, circle.getLatLng().lng]
    );
  });
  circle.on("click", () => {
    circle.setStyle({ fillColor: "#ffffff", color: "#ffffff" });
  });
};
