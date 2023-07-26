import { ISavePolygonsProps } from "../interfaces/savePolygonsProps";
import { IPolygonMap } from "../interfaces/polygonMap";
import * as L from "leaflet";
import * as turf from "@turf/turf";
import { thousandsHundredsTensUnitsNumberString } from "./thousandsHundredsTensUnitsNumberString";
import { getTotalProductByTotalArea } from "./getTotalProductByTotalArea";

export const savePolygons = (
  polygon: L.Layer,
  polygons: IPolygonMap[],
  props: ISavePolygonsProps
) => {
  if (polygon instanceof L.Polygon) {
    const area: number = turf.area(polygon.toGeoJSON()) / 10000;
    const newPolygon: IPolygonMap = {
      area: Math.round(area * 10000) / 10000,
      id: L.stamp(polygon)
    };
    polygons.push(newPolygon);
    let areaString = newPolygon.area.toString().replace(".", ",");
    areaString = thousandsHundredsTensUnitsNumberString(areaString);

    polygon.bindPopup(
      "ID: " + L.stamp(polygon) + " Area: " + areaString + " ha"
    );
    //polygon style
    polygon.setStyle({ color: props.polygonColor });

    //Disable dragging polygons
    var initialPolygonLatLngs = polygon.getLatLngs();
    polygon.on("pm:dragend", () => {
      polygon.setLatLngs(initialPolygonLatLngs);
    });

    props.setTotalAreaPolygons(props.totalAreaPolygons + newPolygon.area);
    props.setTotalAreaPolygons(
      Math.round(props.totalAreaPolygons * 10000) / 10000
    );
    areaString = props.totalAreaPolygons.toString().replace(".", ",");
    props.setTotalAreaPolygonsString(
      thousandsHundredsTensUnitsNumberString(areaString)
    );
    props.setTotalProducts(
      getTotalProductByTotalArea(props.totalAreaPolygons, props.productDensity)
    );
  }
};
