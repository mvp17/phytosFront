import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import TableRow from "./TableRow";

interface IProps {
  data: {
    items: string[][];
  };
}

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  }
});

const ItemsTable = ({ data }: IProps) => (
  <View style={styles.tableContainer}>
    {/*<TableHeader />*/}
    <TableRow items={data.items} />
    {/*<TableFooter items={data.items} />*/}
  </View>
);

export default ItemsTable;
