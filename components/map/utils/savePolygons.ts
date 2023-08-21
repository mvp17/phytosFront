import { IPolygonMap } from "../interfaces/polygonMap";
import * as L from "leaflet";
import * as turf from "@turf/turf";
import { thousandsHundredsTensUnitsNumberString } from "./thousandsHundredsTensUnitsNumberString";
import { getTotalProductByTotalArea } from "./getTotalProductByTotalArea";
import { useMapDataStore } from "../stores/MapDataStore";

export const savePolygons = (polygon: L.Layer, 
                             polygons: IPolygonMap[], 
                             productDensity: number) => {
  const polygonColor = useMapDataStore((state) => state.polygonColor);
  const totalAreaPolygons = useMapDataStore((state) => state.totalAreaPolygons);
  const setTotalAreaPolygons = useMapDataStore((state) => state.setTotalAreaPolygons);
  const setTotalAreaPolygonsString = useMapDataStore((state) => state.setTotalAreaPolygonsString);
  const setTotalProducts = useMapDataStore((state) => state.setTotalProducts);



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
    polygon.setStyle({ color: polygonColor });

    //Disable dragging polygons
    var initialPolygonLatLngs = polygon.getLatLngs();
    polygon.on("pm:dragend", () => {
      polygon.setLatLngs(initialPolygonLatLngs);
    });

    setTotalAreaPolygons(totalAreaPolygons + newPolygon.area);
    setTotalAreaPolygons(
      Math.round(totalAreaPolygons * 10000) / 10000
    );
    areaString = totalAreaPolygons.toString().replace(".", ",");
    setTotalAreaPolygonsString(
      thousandsHundredsTensUnitsNumberString(areaString)
    );
    setTotalProducts(
      getTotalProductByTotalArea(totalAreaPolygons, productDensity)
    );
  }
};
