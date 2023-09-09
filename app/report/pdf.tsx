import { Page, Text, View, Document, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { IInstallation } from "@/app/installations/Installation";
import { useEffect } from "react";
import { useReportStore } from "../../components/map/stores/ReportStore";

interface IProps {
  installation: IInstallation;
  variety: string;
  totalArea: string;
  usedProduct: string;
  productsToInstall: string;
  contactsNames: string[];
  contactsEmails: string[];
  contactsPhoneNumbers: string[];
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4"
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

const PDF = ({installation, 
              variety, 
              totalArea, 
              usedProduct, 
              productsToInstall,
              contactsNames,
              contactsEmails,
              contactsPhoneNumbers
            }: IProps) => {
  return (
    <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Installation report: {installation.name}</Text>
        <Text>Client: {installation.clientName}</Text>
        <Text>Plantation: {installation.plantationName}</Text>
        <Text>Season: {installation.seasonYear}</Text>
        <Text> </Text>
        <View>
          <Text>Variety: {variety}</Text>
          <Text>Total Area: {totalArea}</Text>
          <Text>Used Product: {usedProduct}</Text>
          <Text>Products To Install: {productsToInstall}</Text>
        </View>
        <Text> </Text>
        <Text>Installation date: {installation.installationDate}</Text>
        <Text>Activation date: {installation.activationDate}</Text>
        <Text>Catastral reference:</Text>
        <Text>Province: {installation.province}</Text>
        <Text>Municipality: {installation.municipality}</Text>
        <Text>Polygons and plots: {installation.plotName}</Text>
        <Text> </Text>
        <Text>Contacts:</Text>
        <View>
          <Text>Contact Name: {contactsNames.map((value) => {return "[" + value + "]"})}</Text>
          <Text>Contact Email: {contactsEmails.map((value) => {return "[" + value + "]"})}</Text>
          <Text>Contact Phone Number: {contactsPhoneNumbers.map((value) => {return "[" + value + "]"})}</Text>
        </View>
        <Text> </Text>
        <Text>Features: {installation.features}</Text>
        <Text>Projection observations: {installation.projectionObservations}</Text>
        <Text>Installation observations: {installation.installationObservations}</Text>
        <Text>Revision observations: {installation.revisionObservations}</Text>
        <Text>Retreat observations: {installation.retreatObservations}</Text>
        <Text> </Text>
        <Text>Person in charge signature:</Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text> </Text>
        <Text>Current date:</Text>
      </View>
    </Page>
  </Document>
  )
}

const PDFView = () => {
  const installation = useReportStore((state) => state.installation);
  const variety = useReportStore((state) => state.variety);
  const totalArea = useReportStore((state) => state.totalArea);
  const usedProduct = useReportStore((state) => state.usedProduct);
  const productsToInstall = useReportStore((state) => state.productsToInstall);
  const contactsNames = useReportStore((state) => state.contactName);
  const contactsEmails = useReportStore((state) => state.contactEmail);
  const contactsPhoneNumbers = useReportStore((state) => state.contactPhoneNumber);


  useEffect(() => {}, []);

  return(
  <PDFViewer height={window.innerHeight} width={window.innerWidth}>
      <PDF installation = {installation} 
           variety = {variety} 
           totalArea = {totalArea} 
           usedProduct = {usedProduct} 
           productsToInstall = {productsToInstall}
           contactsNames = {contactsNames}
           contactsEmails = {contactsEmails}
           contactsPhoneNumbers = {contactsPhoneNumbers}
           />
  </PDFViewer>
  )
}

export default PDFView;
