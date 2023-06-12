import * as L from "leaflet";

const AreThereAnyMarkers = (layers: L.Layer[]) => {
  var isMarker: boolean = false;
  layers.forEach((layer: L.Layer) => {
    if (layer instanceof L.Marker) isMarker = true;
  });
  return isMarker;
};

export default AreThereAnyMarkers;
