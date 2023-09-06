import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

interface IProps {
  items: string[][];
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  description: {
    width: "60%"
  },
  xyz: {
    width: "40%"
  }
});

const TableRow = ({ items }: IProps) => {
  const rows = items.map((item) => (
    <View style={styles.row} key={item[0]}>
      <Text style={styles.description}>{item[1]}</Text>
      <Text style={styles.xyz}>{item[2]}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default TableRow;
