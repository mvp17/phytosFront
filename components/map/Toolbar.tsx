import Control from "react-leaflet-custom-control";
import { Stack } from "@mui/material";
import { SaveGeoJSONElementsButton } from "./geoElementsManager/SaveGeoJSONElementsButton";
import { LoadGeoJSONElementsButton } from "./geoElementsManager/LoadGeoJSONElementsButton";
import { CleanMapButton } from "./geoElementsManager/CleanMapButton";
import { DeleteGeoJSONElementsButton } from "./geoElementsManager/DeleteGeoJSONElementsButton";
import ExportMarkersGPXFileButton from "./filesManager/ExportMarkersGPXFileButton";
import ImportMarkersGPXFileButton from "./filesManager/ImportMarkersGPXFileButton";
import { DownloadReportButton } from "./filesManager/DownloadReportButton";
import SeeProductActionRadiusButton from "./geoElementsManager/SeeProductActionRadiusButton";
import { IInstallation } from "@/app/installations/Installation";


interface IProps {
    productDensity: number;
    productColor: string;
    installation: IInstallation;
}

export function Toolbar({ productDensity, productColor, installation}: IProps) {
  return (
    <Control prepend position="bottomleft">
      <Stack direction="column" spacing={2}>
        <SaveGeoJSONElementsButton
          installation={installation}
        />
        <LoadGeoJSONElementsButton installation={installation} productDensity={productDensity} />
        <CleanMapButton />
        <DeleteGeoJSONElementsButton installation={installation} />
        <ExportMarkersGPXFileButton installation={installation}/>
        <ImportMarkersGPXFileButton
          productDensity={productDensity}
          productColor={productColor}
        />
        <DownloadReportButton installation={installation} />
        <SeeProductActionRadiusButton
          productDensity={productDensity}
          productColor={productColor}
        />
      </Stack>
    </Control>
  );
};
