import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useMap } from "react-leaflet";
import SaveIcon from "@mui/icons-material/Save";
import * as L from "leaflet";
import { Dispatch, SetStateAction } from "react";
import { IInstallation } from "@/app/installations/Installation";
import { IMarkerSchema } from "../interfaces/markerSchema";
import { usePostGeoJSONStore } from "../stores/PostGeoJSONStore";

type Dispatcher = Dispatch<SetStateAction<boolean>>;
interface IProps {
  actionRadius: boolean;
  hiddenMarkersByDraggingCircles: Map<string, number[]>;
  setActionRadius: Dispatcher;
  installation: IInstallation;
}

export function SaveGeoJSONElementsButton({
  actionRadius,
  hiddenMarkersByDraggingCircles,
  setActionRadius,
  installation
}: IProps) {
  const map = useMap();
  const postMarkersApi = usePostGeoJSONStore((state) => state.postMarkersApi);
  const postLinestringsApi = usePostGeoJSONStore(
    (state) => state.postLinestringsApi
  );
  const postPolygonsApi = usePostGeoJSONStore((state) => state.postPolygonsApi);

  const save = () => {
    const layers: L.Layer[] = L.PM.Utils.findLayers(map);

    if (layers.length === 0)
      alert("Error. No hi ha elements al mapa per guardar!");
    else {
      if (
        window.confirm(
          "OK: Guardar instal·lació a la base de dades.\n Cancel: No guardar-la."
        )
      ) {
        var markersGroup: IMarkerSchema[] = [];
        if (actionRadius === true) {
          // Si s'ha mogut el cercle, el seu marcador s'haurà eliminat, llavors es necessari de posar el marcador
          // ALLÀ ON HI HAVIA EL CERCLE ES POSA EL MARCADOR AL CENTRE D'AQUEST CERCLE I S'ELIMINA
          layers.forEach((layer: L.Layer) => {
            if (layer instanceof L.Circle) map.removeLayer(layer);
          });
          hiddenMarkersByDraggingCircles.forEach(
            (coordinates: number[], markerId: string) => {
              const latLng: L.LatLng = L.latLng(coordinates[0], coordinates[1]);
              map.addLayer(
                L.marker(latLng)
                  .setIcon(
                    L.divIcon({
                      html:
                        "&nbsp;&nbsp;&nbsp;&nbsp;" +
                        '<b class="strokeme">' +
                        markerId +
                        "</b>"
                    })
                  )
                  .bindPopup(markerId)
              );
            }
          );
          hiddenMarkersByDraggingCircles.clear();
        }
        setActionRadius(false);

        var lineStringsGroup: L.FeatureGroup<L.Layer> = L.featureGroup();
        var polygonsGroup: L.FeatureGroup<L.Layer> = L.featureGroup();
        var layersAfterCircles: L.Layer[] = L.PM.Utils.findLayers(map);

        layersAfterCircles.forEach((layer: L.Layer) => {
          if (layer instanceof L.Marker) {
            const coordinates: number[] = [];
            coordinates.push(layer.getLatLng().lat);
            coordinates.push(layer.getLatLng().lng);
            const marker: IMarkerSchema = {
              type: "Point",
              coordinates: coordinates,
              idInstallation: installation._id,
              waypoint: layer!.getPopup()!.getContent()!.toString()
            };
            markersGroup.push(marker);
          }
          // First to check is L.Polygon, because L.Polygon extends L.Polyline
          else if (layer instanceof L.Polygon) polygonsGroup.addLayer(layer);
          else if (layer instanceof L.Polyline)
            lineStringsGroup.addLayer(layer);
        });

        if (markersGroup.length !== 0) {
          postMarkersApi(JSON.stringify(markersGroup));
          //this.toastr.success('Markers GeoJSON sended');
        }

        if (lineStringsGroup.getLayers().length !== 0) {
          const lineStrings = lineStringsGroup.toGeoJSON();
          postLinestringsApi(JSON.stringify(lineStrings), installation._id);
          //this.toastr.success('LineStrings GeoJSON sended');
        }

        if (polygonsGroup.getLayers().length !== 0) {
          const polygons = polygonsGroup.toGeoJSON();
          postPolygonsApi(JSON.stringify(polygons), installation._id);
          //this.toastr.success('Polygons GeoJSON sended');
        }
      }
    }
  };

  return (
    <Tooltip title="Save data">
      <Button onClick={save}>
        <SaveIcon />
      </Button>
    </Tooltip>
  );
}
