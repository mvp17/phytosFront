import * as L from "leaflet";
import { useMap } from "react-leaflet";

interface IProps {
  props: {
    marker: L.Marker,
    idForMarkers: number,
    productDensity: number,
    productColor: string,
    hiddenMarkersByDraggingCircles: Map<string, number[]>
  }
}

export const createCircleWithActionRadius = ({ props } : IProps) => {
    
  const map = useMap();
  props.marker.setIcon(
    L.divIcon({
      html: "&nbsp;&nbsp;&nbsp;&nbsp;" + props.idForMarkers.toString() + "</b>"
    })
  );

  props.marker.bindPopup(props.idForMarkers.toString());
  const area: number = (1 / props.productDensity) * 10000;
  let radius: number = Math.sqrt(area / Math.PI);
  radius = Math.ceil(radius);
  //console.log("El radi d'acció del producte utilitzat és: ", radius);
  const circle: L.Circle = L.circle(props.marker.getLatLng(), {
    fillColor: props.productColor,
    color: "#000000"
  }).setRadius(radius);
  circle.bindTooltip(props.idForMarkers.toString());
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
    props.hiddenMarkersByDraggingCircles.set(
      circle.getTooltip()!.getContent()!.toString(),
      [circle.getLatLng().lat, circle.getLatLng().lng]
    );
  });
  circle.on("click", () => {
    circle.setStyle({ fillColor: "#ffffff", color: "#ffffff" });
  });
};
