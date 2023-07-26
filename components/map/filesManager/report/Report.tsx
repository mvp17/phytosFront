import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { IInstallation } from "@/app/installations/Installation";
//import { PDFViewer } from "@react-pdf/renderer";
import Table from "./table/Table";

interface IProps {
  props: {
    dataContacts: { items: string[][] };
    installation: IInstallation;
    dataInstallation: { items: string[][] };
  };
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

const Report = ({ props }: IProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Installation report:</Text>
        <Text>{props.installation.name}</Text>
      </View>
      <View style={styles.section}>
        <Text>Client:</Text>
        <Text>{props.installation.clientName}</Text>
      </View>
      <View style={styles.section}>
        <Text>PLantation:</Text>
        <Text>{props.installation.plantationName}</Text>
      </View>
      <View style={styles.section}>
        <Text>Season:</Text>
        <Text>{props.installation.seasonYear}</Text>
      </View>
      <View style={styles.section}>
        <Text>Data:</Text>
        <Table data={props.dataInstallation} />
      </View>
      <View style={styles.section}>
        <Text>Installation date:</Text>
        <Text>{props.installation.installationDate}</Text>
      </View>
      <View style={styles.section}>
        <Text>Activation date:</Text>
        <Text>{props.installation.activationDate}</Text>
      </View>
      <View style={styles.section}>
        <Text>Catastral reference:</Text>
        <Text>Province:</Text>
        <Text>{props.installation.province}</Text>
        <Text>Municipality:</Text>
        <Text>{props.installation.municipality}</Text>
        <Text>Polygons and plots:</Text>
        <Text>{props.installation.plotName}</Text>
      </View>
      <View style={styles.section}>
        <Text>Contacts:</Text>
        <Table data={props.dataContacts} />
      </View>
      <View style={styles.section}>
        <Text>Features:</Text>
        <Text>{props.installation.features}</Text>
      </View>
      <View style={styles.section}>
        <Text>Projection observations:</Text>
        <Text>{props.installation.projectionObservations}</Text>
      </View>
      <View style={styles.section}>
        <Text>Installation observations:</Text>
        <Text>{props.installation.installationObservations}</Text>
      </View>
      <View style={styles.section}>
        <Text>Revision observations:</Text>
        <Text>{props.installation.revisionObservations}</Text>
      </View>
      <View style={styles.section}>
        <Text>Retreat observations:</Text>
        <Text>{props.installation.retreatObservations}</Text>
      </View>
      <View style={styles.section}>
        <Text>Person in charge signature:</Text>
      </View>
      <View style={styles.section}>
        <Text>Current date:</Text>
      </View>
    </Page>
  </Document>
);

export default Report;
