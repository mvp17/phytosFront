import { Page, Text, View, Document, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { IInstallation } from "@/app/installations/Installation";
import Table from "./table/Table";
import { useEffect } from "react";
import { useReportStore } from "../../components/map/stores/ReportStore";

interface IProps {
  dataContacts: { items: string[][] };
  installation: IInstallation;
  dataInstallation: { items: string[][] };
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

const PDF = ({dataContacts, installation, dataInstallation}: IProps) => {
  return (
    <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Installation report: {installation.name}</Text>
        <Text>Client: {installation.clientName}</Text>
        <Text>Plantation: {installation.plantationName}</Text>
        <Text>Season: {installation.seasonYear}</Text>
        <Text> </Text>
        <Text>Data:</Text>
        <Table data={dataInstallation} />
        <Text> </Text>
        <Text>Installation date: {installation.installationDate}</Text>
        <Text>Activation date: {installation.activationDate}</Text>
        <Text>Catastral reference:</Text>
        <Text>Province: {installation.province}</Text>
        <Text>Municipality: {installation.municipality}</Text>
        <Text>Polygons and plots: {installation.plotName}</Text>
        <Text> </Text>
        <Text>Contacts:</Text>
        <Table data={dataContacts} />
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
  const dataContacts = useReportStore((state) => state.dataContacts);
  const installation = useReportStore((state) => state.installation);
  const dataInstallation = useReportStore((state) => state.dataInstallation);

  useEffect(() => {}, []);

  return(
  <PDFViewer height={window.innerHeight} width={window.innerWidth}>
      <PDF dataContacts={dataContacts} installation={installation} dataInstallation={dataInstallation}/>
  </PDFViewer>
  )
}

export default PDFView;
