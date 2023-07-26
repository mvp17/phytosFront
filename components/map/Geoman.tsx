import { FeatureGroup } from "react-leaflet";
import { GeomanControls } from "react-leaflet-geoman-v2";
import * as L from "leaflet";
import * as turf from "@turf/turf";
import { usePolygonsStore } from "./stores/PolygonsStore";
import { Dispatch, SetStateAction } from "react";
import { createCircleWithActionRadius } from "./utils/createCircleWithAcionRadius";
import { thousandsHundredsTensUnitsNumberString } from "./utils/thousandsHundredsTensUnitsNumberString";
import { getDistanceFromTo } from "./utils/getDistanceFromTo";
import { areThereAnyMarkers } from "./utils/areThereAnyMarkers";
import { getMarkersFromMap } from "./utils/getMarkersFromMap";
import { greatestWaypointAmongAllLeaflet } from "./utils/greatestWaypointAmongAllLeaflet";
import { useMap } from "react-leaflet";
import { IPolygonMap } from "./interfaces/polygonMap";
import { getTotalProductByTotalArea } from "./utils/getTotalProductByTotalArea";
import { ISavePolygonsProps } from "./interfaces/savePolygonsProps";
import { savePolygons } from "./utils/savePolygons";

type DispatcherNumber = Dispatch<SetStateAction<number>>;
type DispatcherBoolean = Dispatch<SetStateAction<boolean>>;
type DispatcherString = Dispatch<SetStateAction<string>>;

interface IProps {
  props: {
    polygonColor: string;
    idForMarkers: number;
    setIdForMarkers: DispatcherNumber;
    actionRadius: boolean;
    setActionRadius: DispatcherBoolean;
    productDensity: number;
    productColor: string;
    hiddenMarkersByDraggingCircles: Map<string, number[]>;
    totalAreaPolygons: number;
    setTotalAreaPolygons: DispatcherNumber;
    totalAreaPolygonsString: string;
    setTotalAreaPolygonsString: DispatcherString;
    totalProducts: number;
    setTotalProducts: DispatcherNumber;
    markedProducts: number;
    setMarkedProducts: DispatcherNumber;
  };
}

export default function Geoman({ props }: IProps) {
  const map = useMap();
  const polygons = usePolygonsStore((state) => state.polygonsData);

  const handleChange = () => {
    console.log("Event fired!");
  };

  const savePolygonsProps: ISavePolygonsProps = {
    polygonColor: props.polygonColor,
    totalAreaPolygons: props.totalAreaPolygons,
    setTotalAreaPolygons: props.setTotalAreaPolygons,
    setTotalAreaPolygonsString: props.setTotalAreaPolygonsString,
    setTotalProducts: props.setTotalProducts,
    productDensity: props.productDensity
  };

  const onCreate = (e: { shape: string; layer: L.Layer }) => {
    const layer: L.Layer = e.layer;
    savePolygons(layer, polygons, savePolygonsProps);

    if (layer instanceof L.Marker) {
      if (props.actionRadius) {
        props.setIdForMarkers(props.idForMarkers + 1);
        const propsCircleActionRadius = {
          props: {
            marker: layer,
            idForMarkers: props.idForMarkers,
            productDensity: props.productDensity,
            productColor: props.productColor,
            hiddenMarkersByDraggingCircles: props.hiddenMarkersByDraggingCircles
          }
        }
        createCircleWithActionRadius(propsCircleActionRadius);
        props.setMarkedProducts(props.markedProducts + 1);
      } else {
        props.setIdForMarkers(props.idForMarkers + 1);
        layer.setIcon(
          L.divIcon({
            html:
              "&nbsp;&nbsp;&nbsp;&nbsp;" +
              '<b class="strokeme">' +
              props.idForMarkers.toString() +
              "</b>"
          })
        );
        layer.bindPopup(props.idForMarkers.toString());
        props.setMarkedProducts(props.markedProducts + 1);
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

            props.setTotalAreaPolygons(props.totalAreaPolygons - polygon.area);
            props.setTotalAreaPolygons(
              props.totalAreaPolygons + updatedPolygon.area
            );
            props.setTotalAreaPolygons(
              Math.round(props.totalAreaPolygons * 10000) / 10000
            );

            areaString = props.totalAreaPolygons.toString().replace(".", ",");

            props.setTotalAreaPolygonsString(
              thousandsHundredsTensUnitsNumberString(areaString)
            );
            props.setTotalProducts(
              getTotalProductByTotalArea(
                props.totalAreaPolygons,
                props.productDensity
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
          props.setTotalAreaPolygons(props.totalAreaPolygons - polygon.area);
          props.setTotalAreaPolygons(
            Math.round(props.totalAreaPolygons * 10000) / 10000
          );
          //Change the '.' to ',' (thousands, tens, units)
          let areaString = props.totalAreaPolygons.toString().replace(".", ",");
          props.totalAreaPolygonsString = thousandsHundredsTensUnitsNumberString(
            areaString
          );
          props.setTotalProducts(
            getTotalProductByTotalArea(
              props.totalAreaPolygons,
              props.productDensity
            )
          );
        }
      });
    }
    if (layer instanceof L.Marker) {
      props.setMarkedProducts(props.markedProducts - 1);
      const layers: L.Layer[] = L.PM.Utils.findLayers(map);
      if (!areThereAnyMarkers(layers)) props.setIdForMarkers(0);
      else {
        const markersFromMap: L.Marker[] = getMarkersFromMap(layers);
        props.setIdForMarkers(greatestWaypointAmongAllLeaflet(markersFromMap));
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
