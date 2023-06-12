import Control from "react-leaflet-custom-control";
import { Stack } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import { SaveGeoJSONElementsButton } from "./elementsManager/SaveGeoJSONElementsButton";
import { LoadGeoJSONElementsButton } from "./elementsManager/LoadGeoJSONElementsButton";
import { CleanMapButton } from "./elementsManager/CleanMapButton";
import { DeleteGeoJSONElementsButton } from "./elementsManager/DeleteGeoJSONElementsButton";
import { ExportMarkersGPXFileButton } from "./filesManager/ExportMarkersGPXFileButton";
import ImportMarkersGPXFileButton from "./filesManager/ImportMarkersGPXFileButton";
import { DownloadReportButton } from "./filesManager/DownloadReportButton";
import SeeProductActionRadiusButton from "./elementsManager/SeeProductActionRadiusButton";

type DispatcherIdForMarkers = Dispatch<SetStateAction<number>>;
type DispatcherActionRadius = Dispatch<SetStateAction<boolean>>;

interface IProps {
  idForMarkers: number;
  setIdForMarkers: DispatcherIdForMarkers;
  actionRadius: boolean;
  setActionRadius: DispatcherActionRadius;
  hiddenMarkersByDraggingCircles: Map<string, number[]>;
  productDensity: number;
  productColor: string;
}

const Toolbar = ({
  idForMarkers,
  setIdForMarkers,
  actionRadius,
  setActionRadius,
  hiddenMarkersByDraggingCircles,
  productDensity,
  productColor
}: IProps) => {
  return (
    <Control prepend position="bottomleft">
      <Stack direction="column" spacing={2}>
        <SaveGeoJSONElementsButton />
        <LoadGeoJSONElementsButton />
        <CleanMapButton />
        <DeleteGeoJSONElementsButton />
        <ExportMarkersGPXFileButton />
        <ImportMarkersGPXFileButton
          idForMarkers={idForMarkers}
          setIdForMarkers={setIdForMarkers}
          actionRadius={actionRadius}
          hiddenMarkersByDraggingCircles={hiddenMarkersByDraggingCircles}
          productDensity={productDensity}
          productColor={productColor}
        />
        <DownloadReportButton />
        <SeeProductActionRadiusButton
          actionRadius={actionRadius}
          setActionRadius={setActionRadius}
          productDensity={productDensity}
          productColor={productColor}
          hiddenMarkersByDraggingCircles={hiddenMarkersByDraggingCircles}
        />
      </Stack>
    </Control>
  );
};

export default Toolbar;
