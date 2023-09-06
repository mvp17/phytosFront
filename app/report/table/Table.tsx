import React from "react";
import { StyleSheet } from "@react-pdf/renderer";
import ItemsTable from "./ItemsTable";

interface IProps {
  data: {
    items: string[][];
  };
}

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: "column"
  }
});

const Table = ({ data }: IProps) => (
  <ItemsTable data={data} />
);

export default Table;
