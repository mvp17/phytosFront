import * as L from "leaflet";
import * as turf from "@turf/turf";

export const getDistanceFromTo = (linestring: L.Polyline) => {
  let length: number = linestring.getLatLngs().length;
  var distance: number = 0;
  // "meters" | "millimeters" | "centimeters" | "kilometers" | "acres" | "miles" | "nauticalmiles" | "inches" | "yards" |
  // "feet" | "radians" | "degrees" | "hectares"
  const units: turf.Units = "meters";
  const options = { units: units };

  for (let i = 0; i < length && !(i + 1 > length || i + 2 > length); i++) {
    const firstLatLongFromLineString: any = linestring
      .getLatLngs()
      .slice(i, i + 1)[0];
    let lat: number = firstLatLongFromLineString.lat;
    let lng: number = firstLatLongFromLineString.lng;
    const fromPoint = turf.point([lat, lng]);

    const nextLatLongFromLineString: any = linestring
      .getLatLngs()
      .slice(i + 1, i + 2)[0];
    lat = nextLatLongFromLineString.lat;
    lng = nextLatLongFromLineString.lng;
    const toPoint = turf.point([lat, lng]);

    distance += turf.distance(fromPoint, toPoint, options);
  }

  return distance;
};
