import { Dispatch, SetStateAction } from "react";

type DispatcherNumber = Dispatch<SetStateAction<number>>;
type DispatcherString = Dispatch<SetStateAction<string>>;
export interface ISavePolygonsProps {
  polygonColor: string;
  totalAreaPolygons: number;
  setTotalAreaPolygons: DispatcherNumber;
  setTotalAreaPolygonsString: DispatcherString;
  setTotalProducts: DispatcherNumber;
  productDensity: number;
}
