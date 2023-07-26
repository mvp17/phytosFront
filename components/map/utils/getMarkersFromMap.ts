import * as L from "leaflet";

export const getMarkersFromMap = (layers: L.Layer[]) => {
  const markers: L.Marker[] = [];
  layers.forEach((layer: L.Layer) => {
    if (layer instanceof L.Marker) markers.push(layer);
  });
  return markers;
};
