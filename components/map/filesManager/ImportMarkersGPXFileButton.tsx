import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import UploadIcon from "@mui/icons-material/Upload";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import { Dispatch, SetStateAction } from "react";
import { createCircleWithActionRadius } from "../utils/createCircleWithAcionRadius";
import { useMapDataStore } from "../stores/MapDataStore";

type Dispatcher = Dispatch<SetStateAction<number>>;
interface IProps {
  productDensity: number;
  productColor: string;
}

const ImportMarkersGPXFileButton = ({ productDensity, productColor }: IProps) => {
  const map = useMap();
  const idForMarkers = useMapDataStore((state) => state.idForMarkers);
  const actionRadius = useMapDataStore((state) => state.actionRadius);
  const setIdForMarkers = useMapDataStore((state) => state.setIdForMarkers);
  const markedProducts = useMapDataStore((state) => state.markedProducts);
  const setMarkedProducts = useMapDataStore((state) => state.setMarkedProducts);

  const processGPXHTMLCollection = (collection: HTMLCollection) => {
    var stringLatsLons: [string, string][] = [];
    for (let i = 0; i < collection.length; i++) {
      const lat = collection[i]!.getAttributeNode("lat")!.nodeValue;
      const lon = collection[i]!.getAttributeNode("lon")!.nodeValue;
      if (lat && lon) stringLatsLons.push([lat, lon]);
    }

    setIdForMarkers(1); //this.idForMarkers = 1;
    stringLatsLons.forEach((latLon: [string, string]) => {
      const latLng: L.LatLng = L.latLng(
        parseFloat(latLon[0]),
        parseFloat(latLon[1])
      );
      const marker: L.Marker = L.marker(latLng);
      if (actionRadius) {
        createCircleWithActionRadius(marker, productDensity, productColor);
        setIdForMarkers(idForMarkers + 1);
        setMarkedProducts(markedProducts + 1);
      } else {
        marker.setIcon(
          L.divIcon({
            html:
              "&nbsp;&nbsp;&nbsp;&nbsp;" +
              '<b class="strokeme">' +
              idForMarkers.toString() +
              "</b>"
          })
        );
        marker.bindPopup(idForMarkers.toString());
        setIdForMarkers(idForMarkers + 1);
        setMarkedProducts(markedProducts + 1);
      }
      marker.addTo(map);
    });
    // First marker position to fly on map.
    const latLngToFly = L.latLng(
      parseFloat(stringLatsLons[0][0]),
      parseFloat(stringLatsLons[0][1])
    );
    map.flyTo(latLngToFly, 15);
  };

  const displayMarkersOnMapFromGPX = (gpxFile: File) => {
    let fileReader: FileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.result) {
        const xml = new DOMParser().parseFromString(
          fileReader.result.toString(),
          "text/xml"
        );
        const fileResult = xml.getElementsByTagName("wpt");
        processGPXHTMLCollection(fileResult);
      }
    };
    fileReader.readAsText(gpxFile);
  };

  const importGPX = () => {
    const input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    // accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
    input.accept = ".gpx";
    input.onchange = () => {
      if (input.files) {
        let files = Array.from(input.files);
        files.forEach((file: File) => {
          displayMarkersOnMapFromGPX(file);
        });
      }
    };
    input.click();
  };

  return (
    <Tooltip title="Import GPX">
      <Button onClick={importGPX}>
        <UploadIcon />
      </Button>
    </Tooltip>
  );
};

export default ImportMarkersGPXFileButton;
