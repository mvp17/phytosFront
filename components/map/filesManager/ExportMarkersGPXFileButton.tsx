import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { IMarkerSchema } from "../interfaces/markerSchema";
import { useGetGeoJSONStore } from "../stores/GetGeoJSONStore";
import { IInstallation } from "@/app/installations/Installation";


interface IProps {
  installation: IInstallation;
}

const ExportMarkersGPXFileButton = ({ installation}: IProps) => {
  const geoJSONMarkers = useGetGeoJSONStore((state) => state.installationMarkers);
  const getInstallationMarkers = useGetGeoJSONStore((state) => state.getInstallationMarkersApi);

  const createGPXFileWith = (markersCoordinates: Array<number[]>) => {
    let result: string =
      '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="opennatur"><metadata/>';
    result += "\n";
    markersCoordinates.forEach((markerCoordinate: number[]) => {
      result +=
        "<wpt " +
        `lat="${markerCoordinate[0]}" lon="${markerCoordinate[1]}"` +
        ">" +
        "</wpt>" +
        "\n";
    });
    result += "</gpx>";
    const url: string = "data:text/json;charset=utf-8," + result;
    const link: HTMLAnchorElement = document.createElement("a");
    link.download = "markersLatLon.gpx";
    link.href = url;
    document.body.appendChild(link);
    link.click();
  };

  const exportGPX = () => {
    // mapstore, axios request
    getInstallationMarkers(installation._id);

    if (geoJSONMarkers.length === 0)
      alert("No hi ha waypoints guardats per aquesta instal·lació.");
    else {
      var markersCoordinates: Array<number[]> = [];
      geoJSONMarkers.forEach((marker: IMarkerSchema) => {
        const markerCoordinates = marker.coordinates;
        markersCoordinates.push(markerCoordinates);
      });
      createGPXFileWith(markersCoordinates);
    }
  };

  return (
    <Tooltip title="Export GPX">
      <Button onClick={exportGPX}>
        <FileDownloadIcon />
      </Button>
    </Tooltip>
  );
};

export default ExportMarkersGPXFileButton;
