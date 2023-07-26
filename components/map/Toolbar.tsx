import Control from "react-leaflet-custom-control";
import { Stack } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { SaveGeoJSONElementsButton } from "./elementsManager/SaveGeoJSONElementsButton";
import { LoadGeoJSONElementsButton } from "./elementsManager/LoadGeoJSONElementsButton";
import { CleanMapButton } from "./elementsManager/CleanMapButton";
import { DeleteGeoJSONElementsButton } from "./elementsManager/DeleteGeoJSONElementsButton";
import ExportMarkersGPXFileButton from "./filesManager/ExportMarkersGPXFileButton";
import ImportMarkersGPXFileButton from "./filesManager/ImportMarkersGPXFileButton";
import { DownloadReportButton } from "./filesManager/DownloadReportButton";
import SeeProductActionRadiusButton from "./elementsManager/SeeProductActionRadiusButton";
import { IInstallation } from "@/app/installations/Installation";

type DispatcherNumber = Dispatch<SetStateAction<number>>;
type DispatcherActionRadius = Dispatch<SetStateAction<boolean>>;
type DispatcherString = Dispatch<SetStateAction<string>>;

interface IProps {
  props: {
    idForMarkers: number;
    setIdForMarkers: DispatcherNumber;
    actionRadius: boolean;
    setActionRadius: DispatcherActionRadius;
    hiddenMarkersByDraggingCircles: Map<string, number[]>;
    productDensity: number;
    productColor: string;
    installation: IInstallation;
    polygonColor: string;
    totalAreaPolygons: number;
    setTotalAreaPolygons: DispatcherNumber;
    setTotalAreaPolygonsString: DispatcherString;
    setTotalProducts: DispatcherNumber;
    setMarkedProducts: DispatcherNumber;
  };
}

const Toolbar = ({ props }: IProps) => {
  const loadGeoJSONElementsButtonProps = {
    installation: props.installation,
    idForMarkers: props.idForMarkers,
    setIdForMarkers: props.setIdForMarkers,
    polygonColor: props.polygonColor,
    totalAreaPolygons: props.totalAreaPolygons,
    setTotalAreaPolygons: props.setTotalAreaPolygons,
    setTotalAreaPolygonsString: props.setTotalAreaPolygonsString,
    setTotalProducts: props.setTotalProducts,
    productDensity: props.productDensity
  };

  const cleanMapButtonProps = {
    setIdForMarkers: props.setIdForMarkers,
    setTotalAreaPolygons: props.setTotalAreaPolygons,
    setTotalProducts: props.setTotalProducts,
    setMarkedProducts: props.setMarkedProducts,
    setTotalAreaPolygonsString: props.setTotalAreaPolygonsString
  };

  return (
    <Control prepend position="bottomleft">
      <Stack direction="column" spacing={2}>
        <SaveGeoJSONElementsButton
          actionRadius={props.actionRadius}
          hiddenMarkersByDraggingCircles={props.hiddenMarkersByDraggingCircles}
          setActionRadius={props.setActionRadius}
          installation={props.installation}
        />
        <LoadGeoJSONElementsButton props={loadGeoJSONElementsButtonProps} />
        <CleanMapButton props={cleanMapButtonProps} />
        <DeleteGeoJSONElementsButton installation={props.installation} />
        <ExportMarkersGPXFileButton />
        <ImportMarkersGPXFileButton
          idForMarkers={props.idForMarkers}
          setIdForMarkers={props.setIdForMarkers}
          actionRadius={props.actionRadius}
          hiddenMarkersByDraggingCircles={props.hiddenMarkersByDraggingCircles}
          productDensity={props.productDensity}
          productColor={props.productColor}
        />
        <DownloadReportButton installation={props.installation} />
        <SeeProductActionRadiusButton
          actionRadius={props.actionRadius}
          setActionRadius={props.setActionRadius}
          productDensity={props.productDensity}
          productColor={props.productColor}
          hiddenMarkersByDraggingCircles={props.hiddenMarkersByDraggingCircles}
        />
      </Stack>
    </Control>
  );
};

export default Toolbar;
