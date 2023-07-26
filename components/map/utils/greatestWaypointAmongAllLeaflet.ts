import * as L from "leaflet";

export const greatestWaypointAmongAllLeaflet = (markers: L.Marker[]) => {
  let largest = Number(markers[0]!.getPopup()!.getContent()!.toString());
  markers.forEach((marker) => {
    if (Number(marker!.getPopup()!.getContent()!.toString()) > largest)
      largest = Number(marker!.getPopup()!.getContent()!.toString());
  });
  return largest;
};
