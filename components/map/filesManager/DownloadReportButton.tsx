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
  
  const setDataContactsReportStore = useReportStore((state) => state.setDataContacts);
  const setInstallationReportStore = useReportStore((state) => state.setInstallation);
  const setdataInstallationReportStore = useReportStore((state) => state.setDataInstallation);

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

  const getSavedMarkersAndSavedPolygonsTotalAreaFromInstallationForReport = (id: string) => {
    getInstallationMarkers(id).then(() => {
      if (allMarkers.length === 0) installationMarkersReport = "There are no saved markers.";
      else installationMarkersReport = allMarkers.length.toString();
    });
    getInstallationPolygons(id).then(() => {
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
    });
  };

  useEffect(() => {
    getSavedMarkersAndSavedPolygonsTotalAreaFromInstallationForReport(installation._id);
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
    let contactsRows: string[][] = [];
    let contactsForReport = getPersonsInfoFrom(installation.contacts);
    contactsRows.push(["Nom", "Mail", "Telèfon"]);
    contactsForReport.forEach((contact) => {
      contactsRows.push([
        contact.name,
        contact.email,
        contact.phoneNumber.toString()
      ]);
    });
    let installationDataRows: string[][] = [];
    installationDataRows.push([
      "Varietats",
      "Àrea total",
      "Producte Utilitzat",
      "Productes per instal·lar"
    ]);
    installationDataRows.push([
      getVarietyFromProduct(installation.productName),
      totalAreaReport + " ha",
      installation.productName,
      installationMarkersReport
    ]);

    const dataContactsRows = {
      items: contactsRows
    };
    const dataInstallationRows = {
      items: installationDataRows
    };

    setDataContactsReportStore(dataContactsRows);
    useReportStore.getState().dataContacts;

    setInstallationReportStore(installation);
    useReportStore.getState().installation;

    setdataInstallationReportStore(dataInstallationRows);
    useReportStore.getState().dataInstallation;

    router.push('/report');
  };

  return (
    <Tooltip title="Download report">
      <Button onClick={download}>
        <SummarizeIcon />
      </Button>
    </Tooltip>
  );
}
