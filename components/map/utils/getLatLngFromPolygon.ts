import * as L from "leaflet";
import { IPolygonSchema } from "../interfaces/polygonSchema";

export const getLatLngFromPolygon = (polygon: IPolygonSchema) => {
  // Polygons use triple nested array
  let latLngExpression: L.LatLngExpression[] = [];
  polygon.coordinates.forEach((polygonArrayCoordinates: number[][]) => {
    // There is always only one element to loop. Just one loop to access the coordinates of the polygon.
    polygonArrayCoordinates.forEach((coordinate: number[]) => {
      latLngExpression.push(L.latLng(coordinate[1], coordinate[0]));
    });
  });
  return latLngExpression;
};
