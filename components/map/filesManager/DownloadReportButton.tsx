import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { useMap } from "react-leaflet";
import { IPerson } from "@/app/persons/Person";
import { IInstallation } from "@/app/installations/Installation";
import { IProduct } from "@/app/products/Product";
import { useEffect } from "react";
import { usePersonStore } from "@/app/persons/PersonsStore";
import { useProductStore } from "@/app/products/ProductsStore";
import ReactPDF from "@react-pdf/renderer";
//import { PDFViewer } from "@react-pdf/renderer";
import Report from "./report/Report";

interface IProps {
  installation: IInstallation;
}

export function DownloadReportButton({ installation }: IProps) {
  const map = useMap();
  //personService.persons
  const allPersons = usePersonStore((state) => state.personsData);
  //productService.products
  const allProducts = useProductStore((state) => state.productsData);

  let totalAreaReport: string = "0";
  let installationMarkersReport: string = "0";

  const getSavedMarkersAndSavedPolygonsTotalAreaFromInstallationForReport = (
    id: string
  ) => {};

  useEffect(() => {
    /*getSavedMarkersAndSavedPolygonsTotalAreaFromInstallationForReport(
      installation._id
    );*/
  });

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
        contact.telephone_number.toString()
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

    const props = {
      dataContacts: dataContactsRows,
      installation: installation,
      dataInstallation: dataInstallationRows
    };

    ReactPDF.render(<Report props={props} />, `${__dirname}/report.pdf`);
  };

  return (
    <Tooltip title="Download report">
      <Button onClick={download}>
        <SummarizeIcon />
      </Button>
    </Tooltip>
  );
}
