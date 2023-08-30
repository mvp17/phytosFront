import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useMap } from "react-leaflet";
import { useGetGeoJSONStore } from "../stores/GetGeoJSONStore";
import { IInstallation } from "@/app/installations/Installation";
import { IMarkerSchema } from "../interfaces/markerSchema";
import * as L from "leaflet";
import { areThereAnyMarkers } from "../utils/areThereAnyMarkers";
import { getMarkersFromMap } from "../utils/getMarkersFromMap";
import { greatestWaypointAmongAllLeaflet } from "../utils/greatestWaypointAmongAllLeaflet";
import { ILineStringSchema } from "../interfaces/linestringSchema";
import { getDistanceFromTo } from "../utils/getDistanceFromTo";
import { thousandsHundredsTensUnitsNumberString } from "../utils/thousandsHundredsTensUnitsNumberString";
import { getLatLngFromLinestring } from "../utils/getLatLngFromLinestring";
import { getLatLngFromPolygon} from "../utils/getLatLngFromPolygon";
import { IPolygonSchema } from "../interfaces/polygonSchema";
import { usePolygonsStore } from "../stores/PolygonsStore";
import { useMapDataStore } from "../stores/MapDataStore";
import { IPolygonMap } from "../interfaces/polygonMap";
import { getTotalProductByTotalArea } from "../utils/getTotalProductByTotalArea";
import * as turf from "@turf/turf";

interface IProps {
  installation: IInstallation;
  productDensity: number;
}

export function LoadGeoJSONElementsButton({ installation, productDensity }: IProps) {
  const map = useMap();
  let idForMarkers = useMapDataStore((state) => state.idForMarkers);
  const setIdForMarkers = useMapDataStore((state) => state.setIdForMarkers);
  let markedProducts = useMapDataStore((state) => state.markedProducts);
  const setMarkedProducts = useMapDataStore((state) => state.setMarkedProducts);

  const setTotalAreaPolygons = useMapDataStore((state) => state.setTotalAreaPolygons);
  const setTotalAreaPolygonsString = useMapDataStore((state) => state.setTotalAreaPolygonsString);
  let totalAreaPolygonsString = useMapDataStore((state) => state.totalAreaPolygonsString);
  const setTotalProducts = useMapDataStore((state) => state.setTotalProducts);
  let totalProducts = useMapDataStore((state) => state.totalProducts);
  let totalAreaPolygons = useMapDataStore((state) => state.totalAreaPolygons);

  const polygonsFromStore = usePolygonsStore((state) => state.polygonsData);
  const allInstallationMarkers = useGetGeoJSONStore(
    (state) => state.markersData
  );
  const allInstallationLinestrings = useGetGeoJSONStore(
    (state) => state.linestringsData
  );
  const allInstallationPolygons = useGetGeoJSONStore(
    (state) => state.polygonsData
  );
  const getInstallationMarkersApi = useGetGeoJSONStore(
    (state) => state.getInstallationMarkersApi
  );
  const getInstallationLinestringsApi = useGetGeoJSONStore(
    (state) => state.getInstallationLinestringsApi
  );
  const getInstallationPolygonsApi = useGetGeoJSONStore(
    (state) => state.getInstallationPolygonsApi
  );

  const savePolygons = (polygon: L.Layer, polygons: IPolygonMap[], productDensity: number) => {
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
      polygon.setStyle({ color: useMapDataStore.getState().polygonColor });
  
      //Disable dragging polygons
      var initialPolygonLatLngs = polygon.getLatLngs();
      polygon.on("pm:dragend", () => {
        polygon.setLatLngs(initialPolygonLatLngs);
      });
  
      setTotalAreaPolygons(totalAreaPolygons + newPolygon.area);
      totalAreaPolygons = useMapDataStore.getState().totalAreaPolygons;

      setTotalAreaPolygons(
        Math.round(totalAreaPolygons * 10000) / 10000
      );
      totalAreaPolygons = useMapDataStore.getState().totalAreaPolygons;

      areaString = totalAreaPolygons.toString().replace(".", ",");
      setTotalAreaPolygonsString(
        thousandsHundredsTensUnitsNumberString(areaString)
      );
      totalAreaPolygonsString = useMapDataStore.getState().totalAreaPolygonsString;
      
      setTotalProducts(
        getTotalProductByTotalArea(totalAreaPolygons, productDensity)
      );
      totalProducts = useMapDataStore.getState().totalProducts;
    }
  }

  const load = () => {
    getInstallationMarkersApi(installation._id);
    const markers: IMarkerSchema[] = allInstallationMarkers;
    if (markers.length === 0)
      alert("No hi ha waypoints guardats per aquesta instal·lació!");
    else {
      const layers: L.Layer[] = L.PM.Utils.findLayers(map);
      if (areThereAnyMarkers(layers)) {
        if (
          window.confirm(
            "OK: Carregar els punts guardats anteriorment juntament amb els que has posat ara.\n" +
              "Cancel: No carregar-los."
          )
        ) {
          // Si entra aquí, carregarà els punts guardats de la bd juntament amb els que hi ha al mapa.
          const markersFromMapInit: L.Marker[] = getMarkersFromMap(layers);
          setIdForMarkers(
            greatestWaypointAmongAllLeaflet(markersFromMapInit)
          );
          idForMarkers = useMapDataStore.getState().idForMarkers;

          markers.forEach((marker: IMarkerSchema) => {
            const latLngExpression = L.latLng(
              marker.coordinates[0],
              marker.coordinates[1]
            );
            const markerToMap: L.Marker = L.marker(latLngExpression);
            setIdForMarkers(idForMarkers + 1);
            idForMarkers = useMapDataStore.getState().idForMarkers;
            markerToMap.setIcon(
              L.divIcon({
                html: `&nbsp;&nbsp;&nbsp;&nbsp; <b class="strokeme"> ${idForMarkers.toString()}</b>`
              })
            );
            markerToMap.bindPopup(idForMarkers.toString());
            map.addLayer(markerToMap);
            // It is supposed that in here there are less added products to the map
            // than the total number of products available for the installation.
            setMarkedProducts(markedProducts + 1);
            markedProducts = useMapDataStore.getState().markedProducts;
          });
          // First marker position to fly on map.
          const latLngToFly = L.latLng(
            markers[0].coordinates[0],
            markers[0].coordinates[1]
          );
          map.flyTo(latLngToFly, 15);
          const layersEnd: L.Layer[] = L.PM.Utils.findLayers(map);
          const markersFromMapEnd: L.Marker[] = getMarkersFromMap(layersEnd);
          setIdForMarkers(
            greatestWaypointAmongAllLeaflet(markersFromMapEnd)
          );
          idForMarkers = useMapDataStore.getState().idForMarkers;
        }
      } else {
        if (
          window.confirm(
            "OK: Carregar poligons i punts guardats.\nCancel: Carregar només els poligons."
          )
        ) {
          // Si entra aquí, només carregarà els punts guardats de la bd.
          // Després carregarà si hi ha linestrings i/o poligons.
          markers.forEach((marker: IMarkerSchema) => {
            const latLngExpression = L.latLng(
              marker.coordinates[0],
              marker.coordinates[1]
            );
            const markerToMap: L.Marker = L.marker(latLngExpression);
            markerToMap.setIcon(
              L.divIcon({
                html: `&nbsp;&nbsp;&nbsp;&nbsp; <b class="strokeme"> ${marker.waypoint.toString()}</b>`
              })
            );
            markerToMap.bindPopup(marker.waypoint.toString());

            map.addLayer(markerToMap);
            // It is supposed that in here there are less added products to the map
            // than the total number of products available for the installation.
            // TODO this.mapService.markedProducts += 1;
          });
          // First marker position to fly on map.
          const latLngToFly = L.latLng(
            markers[0].coordinates[0],
            markers[0].coordinates[1]
          );
          map.flyTo(latLngToFly, 15);
          const layersEnd: L.Layer[] = L.PM.Utils.findLayers(map);
          const markersFromMapEnd: L.Marker[] = getMarkersFromMap(layersEnd);
          setIdForMarkers(
            greatestWaypointAmongAllLeaflet(markersFromMapEnd)
          );
          idForMarkers = useMapDataStore.getState().idForMarkers;
        }
      }
    }

    getInstallationLinestringsApi(installation._id);
    const linestrings: ILineStringSchema[] = allInstallationLinestrings;
    if (linestrings.length === 0)
      alert("No hi ha distàncies guardades per aquesta instal·lació!");
    else {
      linestrings.forEach((lineString: ILineStringSchema) => {
        const latLngExpression: L.LatLngExpression[] = getLatLngFromLinestring(
          lineString
        );
        const lineStringToMap: L.Polyline = L.polyline(latLngExpression);
        let distance: number = getDistanceFromTo(lineStringToMap);
        distance = Math.round(distance * 10000) / 10000;
        let distanceString = distance.toString().replace(".", ",");
        let resultDistance = thousandsHundredsTensUnitsNumberString(
          distanceString
        );
        lineStringToMap.bindPopup(resultDistance + " metres");
        map.addLayer(lineStringToMap);
      });
    }

    getInstallationPolygonsApi(installation._id);
    const polygons: IPolygonSchema[] = allInstallationPolygons;
    if (polygons.length === 0)
      alert("No hi ha polígons guardats per aquesta instal·lació!");
    else {
      polygons.forEach((polygon: IPolygonSchema) => {
        const latLngExpression: L.LatLngExpression[] = getLatLngFromPolygon(
          polygon
        );
        const polygonToMap: L.Polygon = L.polygon(latLngExpression);
        map.addLayer(polygonToMap);
        savePolygons(polygonToMap, polygonsFromStore, productDensity);
      });
    }
  };

  return (
    <Tooltip title="Load data">
      <Button onClick={load}>
        <CloudDownloadIcon />
      </Button>
    </Tooltip>
  );
}
