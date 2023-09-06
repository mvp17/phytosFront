import { create } from "zustand";
import { IPolygonMap } from "../interfaces/polygonMap";

type PolygonsState = {
  polygonsData: IPolygonMap[];
  resetPolygons: () => void;
}

export const usePolygonsStore = create<PolygonsState>()((set) => ({
  polygonsData: [],
  resetPolygons: () => set(() => ({polygonsData: []}))
}));
