import * as L from "leaflet";

export const areThereAnyMarkers = (layers: L.Layer[]) => {
  var isMarker: boolean = false;
  layers.forEach((layer: L.Layer) => {
    if (layer instanceof L.Marker) isMarker = true;
  });
  return isMarker;
};
