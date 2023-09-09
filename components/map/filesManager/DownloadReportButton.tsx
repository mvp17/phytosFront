import * as L from "leaflet";
import * as turf from "@turf/turf";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { IPerson } from "@/app/persons/Person";
import { IInstallation } from "@/app/installations/Installation";
import { IProduct } from "@/app/products/Product";
import { useEffect } from "react";
import { usePersonStore } from "@/app/persons/PersonsStore";
import { useProductStore } from "@/app/products/ProductsStore";
import { useGetGeoJSONStore } from "../stores/GetGeoJSONStore";
import { IPolygonSchema } from "../interfaces/polygonSchema";
import { getLatLngFromPolygon } from "../utils/getLatLngFromPolygon";
import { thousandsHundredsTensUnitsNumberString } from "../utils/thousandsHundredsTensUnitsNumberString";
import { useReportStore } from "../stores/ReportStore";
import { useRouter } from "next/navigation";

interface IProps {
  installation: IInstallation;
}

export function DownloadReportButton({ installation }: IProps) {
  const router = useRouter();
  
  const setVarietyReportStore = useReportStore((state) => state.setVariety);
  const setTotalAreaReportStore = useReportStore((state) => state.setTotalArea);
  const setUsedProductReportStore = useReportStore((state) => state.setUsedProduct);
  const setProductsToInstallReportStore = useReportStore((state) => state.setProductsToInstall);
  const setInstallationReportStore = useReportStore((state) => state.setInstallation);
  const setContactNameReportStore = useReportStore((state) => state.setContactName);
  const setContactEmailReportStore = useReportStore((state) => state.setContactEmail);
  const setContactPhoneNumberReportStore = useReportStore((state) => state.setContactPhoneNumber);

  const allPersons = usePersonStore((state) => state.personsData);
  const getPersonsStore = usePersonStore((state) => state.getAll);
  const allProducts = useProductStore((state) => state.productsData);
  const getProductsStore = useProductStore((state) => state.getAll);
  const allMarkers = useGetGeoJSONStore((state) => state.installationMarkers);
  const getInstallationMarkers = useGetGeoJSONStore((state) => state.getInstallationMarkersApi);
  const allPolygons = useGetGeoJSONStore((state) => state.installationPolygons);  
  const getInstallationPolygons = useGetGeoJSONStore((state) => state.getInstallationPolygonsApi);

  let totalAreaReport: string = "0";
  let installationMarkersReport: string = "0";

  useEffect(() => {
    getPersonsStore();
    getProductsStore()
  }, []);

  const getPersonsInfoFrom = (contacts: string[]) => {
    let persons: IPerson[] = [];
    for (let i = 0; i < contacts.length; i++) {
      for (let j = 0; j < allPersons.length; j++) {
        if (contacts[i] === allPersons[j].name) persons.push(allPersons[j]);
      }
    }
    return persons;
  };

  const getVarietyFromProduct = (productName: string) => {
    let variety: string = "";
    allProducts.forEach((product: IProduct) => {
      if (productName === product.commonName) variety = product.affectedVariety;
    });
    return variety;
  };

  const download = () => {
    getInstallationMarkers(installation._id).then(() => {
      if (allMarkers.length === 0) installationMarkersReport = "There are no saved markers.";
      else installationMarkersReport = allMarkers.length.toString();
      getInstallationPolygons(installation._id).then(() => {
        if (allPolygons.length === 0) totalAreaReport = "There are no saved polygons";
        else {
          let totalArea: number = 0;
          allPolygons.forEach((polygon: IPolygonSchema) => {
            const latLngExpression: L.LatLngExpression[] = getLatLngFromPolygon(polygon);
            const polygonToMap: L.Polygon = L.polygon(latLngExpression);
            const area: number = turf.area(polygonToMap.toGeoJSON()) / 10000;
            totalArea += area;
          });
          totalAreaReport = (Math.round(totalArea*10000)/10000).toString().replace('.', ',');
          totalAreaReport = thousandsHundredsTensUnitsNumberString(totalAreaReport);
        }
        let contactsForReport = getPersonsInfoFrom(installation.contacts);
        let contactsNames: string[] = [];
        let contactsEmails: string[] = [];
        let contactsPhoneNumbers: string[] = [];

        contactsForReport.forEach((contact) => {
          contactsNames.push(contact.name);
          contactsEmails.push(contact.email);
          contactsPhoneNumbers.push(contact.phoneNumber.toString());
        });

        setVarietyReportStore(getVarietyFromProduct(installation.productName));
        useReportStore.getState().variety;

        setTotalAreaReportStore(totalAreaReport + " ha");
        useReportStore.getState().totalArea;

        setUsedProductReportStore(installation.productName);
        useReportStore.getState().usedProduct;

        setProductsToInstallReportStore(installationMarkersReport);
        useReportStore.getState().productsToInstall;

        setInstallationReportStore(installation);
        useReportStore.getState().installation;
        
        setContactNameReportStore(contactsNames);
        useReportStore.getState().contactName;

        setContactEmailReportStore(contactsEmails);
        useReportStore.getState().contactEmail;
        
        setContactPhoneNumberReportStore(contactsPhoneNumbers);
        useReportStore.getState().contactPhoneNumber;

        router.push('/report');
      });
    });
  };

  return (
    <Tooltip title="Download report">
      <Button onClick={download}>
        <SummarizeIcon />
      </Button>
    </Tooltip>
  );
}
