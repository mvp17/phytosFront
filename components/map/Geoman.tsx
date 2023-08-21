import { FeatureGroup } from "react-leaflet";
import { GeomanControls } from "react-leaflet-geoman-v2";
import * as L from "leaflet";
import * as turf from "@turf/turf";
import { usePolygonsStore } from "./stores/PolygonsStore";
import { useEffect } from "react";
import { createCircleWithActionRadius } from "./utils/createCircleWithAcionRadius";
import { thousandsHundredsTensUnitsNumberString } from "./utils/thousandsHundredsTensUnitsNumberString";
import { getDistanceFromTo } from "./utils/getDistanceFromTo";
import { areThereAnyMarkers } from "./utils/areThereAnyMarkers";
import { getMarkersFromMap } from "./utils/getMarkersFromMap";
import { greatestWaypointAmongAllLeaflet } from "./utils/greatestWaypointAmongAllLeaflet";
import { useMap } from "react-leaflet";
import { IPolygonMap } from "./interfaces/polygonMap";
import { getTotalProductByTotalArea } from "./utils/getTotalProductByTotalArea";
import { savePolygons } from "./utils/savePolygons";
import { useMapDataStore } from "./stores/MapDataStore";

interface IProps {
  productDensity: number;
  productColor: string;
}

export function GeomanWrapper({productDensity, productColor}: IProps) {
  const map = useMap();
  const polygons = usePolygonsStore((state) => state.polygonsData);
  const idForMarkers = useMapDataStore((state) => state.idForMarkers);
  const actionRadius = useMapDataStore((state) => state.actionRadius);
  const totalAreaPolygons = useMapDataStore((state) => state.totalAreaPolygons);
  const markedProducts = useMapDataStore((state) => state.markedProducts);
  const setIdForMarkers = useMapDataStore((state) => state.setIdForMarkers);
  const setTotalAreaPolygons = useMapDataStore((state) => state.setTotalAreaPolygons);
  const setTotalAreaPolygonsString = useMapDataStore((state) => state.setTotalAreaPolygonsString);
  const setTotalProducts = useMapDataStore((state) => state.setTotalProducts);
  const setMarkedProducts = useMapDataStore((state) => state.setMarkedProducts);

  const handleChange = () => {
    console.log("Event fired!");
  };

  useEffect(() => {
    console.log("hola")
  }, [map]);

  const onCreate = (e: { shape: string; layer: L.Layer }) => {
    const layer: L.Layer = e.layer;
    savePolygons(layer, polygons, productDensity);
    if (layer instanceof L.Marker) {
      if (actionRadius) {
        setIdForMarkers(idForMarkers + 1);
        createCircleWithActionRadius(layer, productDensity, productColor);
        setMarkedProducts(markedProducts + 1);
      } else {
        setIdForMarkers(idForMarkers + 1);
        layer.setIcon(
          L.divIcon({
            html:
              "&nbsp;&nbsp;&nbsp;&nbsp;" +
              '<b class="strokeme">' +
              idForMarkers.toString() +
              "</b>"
          })
        );
        layer.bindPopup(idForMarkers.toString());
        setMarkedProducts(markedProducts + 1);
      }
    }

    if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
      let distance: number = getDistanceFromTo(layer);
      distance = Math.round(distance * 10000) / 10000;
      let distanceString = distance.toString().replace(".", ",");
      let resultDistance = thousandsHundredsTensUnitsNumberString(
        distanceString
      );
      layer.bindPopup(resultDistance + " metres");
    }

    if (layer instanceof L.Polygon) {
      layer.on("pm:edit", (e) => {
        const editedLayer: L.Layer = e.layer;
        polygons.forEach((polygon: IPolygonMap) => {
          if (
            polygon.id === L.stamp(layer) &&
            editedLayer instanceof L.Polygon
          ) {
            const polygonToRemoveIndex = polygons.indexOf(polygon);
            // Remove the polygon from saved polygons array
            polygons.splice(polygonToRemoveIndex, 1);

            const area: number = turf.area(editedLayer.toGeoJSON()) / 10000;
            const updatedPolygon: IPolygonMap = {
              area: Math.round(area * 10000) / 10000,
              id: L.stamp(layer)
            };
            polygons.push(updatedPolygon);
            let areaString = updatedPolygon.area.toString().replace(".", ",");
            areaString = thousandsHundredsTensUnitsNumberString(areaString);
            editedLayer.bindPopup(
              "ID: " + L.stamp(editedLayer) + " Area: " + areaString + " ha"
            );

            setTotalAreaPolygons(totalAreaPolygons - polygon.area);
            setTotalAreaPolygons(
              totalAreaPolygons + updatedPolygon.area
            );
            setTotalAreaPolygons(
              Math.round(totalAreaPolygons * 10000) / 10000
            );

            areaString = totalAreaPolygons.toString().replace(".", ",");

            setTotalAreaPolygonsString(
              thousandsHundredsTensUnitsNumberString(areaString)
            );
            setTotalProducts(
              getTotalProductByTotalArea(
                totalAreaPolygons,
                productDensity
              )
            );
          }
        });
      });
    }
  };

  const onRemove = (e: { shape: string; layer: L.Layer }) => {
    const layer: L.Layer = e.layer;
    if (layer instanceof L.Polygon) {
      polygons.forEach((polygon: IPolygonMap) => {
        if (polygon.id === L.stamp(layer)) {
          const polygonToRemoveIndex = polygons.indexOf(polygon);
          polygons.splice(polygonToRemoveIndex, 1);
          setTotalAreaPolygons(totalAreaPolygons - polygon.area);
          setTotalAreaPolygons(
            Math.round(totalAreaPolygons * 10000) / 10000
          );
          //Change the '.' to ',' (thousands, tens, units)
          let areaString = totalAreaPolygons.toString().replace(".", ",");
          setTotalAreaPolygonsString(thousandsHundredsTensUnitsNumberString(areaString));
          setTotalProducts(getTotalProductByTotalArea(totalAreaPolygons,productDensity));
        }
      });
    }
    if (layer instanceof L.Marker) {
      setMarkedProducts(markedProducts - 1);
      const layers: L.Layer[] = L.PM.Utils.findLayers(map);
      if (!areThereAnyMarkers(layers)) setIdForMarkers(0);
      else {
        const markersFromMap: L.Marker[] = getMarkersFromMap(layers);
        setIdForMarkers(greatestWaypointAmongAllLeaflet(markersFromMap));
      }
    }
  };

  return (
    <FeatureGroup>
      <GeomanControls
        options={{
          position: "topright",
          drawText: false
        }}
        globalOptions={{
          continueDrawing: true,
          editable: false
        }}
        onCreate={(e) => onCreate(e)}
        onChange={handleChange}
        onUpdate={handleChange}
        onEdit={handleChange}
        onMapRemove={(e) => onRemove(e)}
        onMapCut={handleChange}
        onDragEnd={handleChange}
        onMarkerDragEnd={handleChange}
      />
    </FeatureGroup>
  );
}
