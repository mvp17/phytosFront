import * as L from "leaflet";
import { ILineStringSchema } from "../interfaces/linestringSchema";

export const getLatLngFromLinestring = (lineString: ILineStringSchema) => {
  let latLngExpression: L.LatLngExpression[] = [];
  lineString.coordinates.forEach((coordinate: number[]) => {
    latLngExpression.push(L.latLng(coordinate[1], coordinate[0]));
  });
  return latLngExpression;
};
