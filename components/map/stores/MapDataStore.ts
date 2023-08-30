import { create } from "zustand";

type MapState = {
  idForMarkers: number;
  actionRadius: boolean;
  totalAreaPolygons: number;
  totalAreaPolygonsString: string;
  totalProducts: number;
  markedProducts: number;
  polygonColor: string;
  hiddenMarkersByDraggingCircles: Map<string, number[]>;
  setIdForMarkers: (newValue: number) => void
  setActionRadius: (newValue: boolean) => void;
  setTotalAreaPolygons: (newValue: number) => void;
  setTotalAreaPolygonsString: (newValue: string) => void;
  setTotalProducts: (newValue: number) => void;
  setMarkedProducts: (newValue: number) => void;
  setHiddenMarkersByDraggingCircles: () => void;
}

/*
ZUSTAND DOCUMENTATION, Typescript guide
Also, we recommend using devtools middleware as last as possible. 
For example, when you use it with immer as a middleware, 
it should be immer(devtools(...)) and not devtools(immer(...)). 
This is because devtools mutates the setState and adds a type parameter on it, 
which could get lost if other middlewares (like immer) also mutate 
setState before devtools. 
Hence using devtools at the end makes sure that no middlewares mutate 
setState before it.
*/

export const useMapDataStore = create<MapState>()((set) => ({
    idForMarkers: 0,
    actionRadius: false,
    totalAreaPolygons: 0,
    totalAreaPolygonsString: "0",
    totalProducts: 0,
    markedProducts: 0,
    polygonColor: "#FFFB89",
    hiddenMarkersByDraggingCircles: new Map<string, number[]>(),
    setIdForMarkers: (newValue: number) => set(() => ({ idForMarkers: newValue })),
    setActionRadius: (newValue: boolean) => set(() => ({actionRadius: newValue})),
    setTotalAreaPolygons: (newValue: number) => set(() => ({totalAreaPolygons: newValue})),
    setTotalAreaPolygonsString: (newValue: string) => set(() => ({totalAreaPolygonsString: newValue})),
    setTotalProducts: (newValue: number) => set(() => ({totalProducts: newValue})),
    setMarkedProducts: (newValue: number) => set(() => ({markedProducts: newValue})),
    setHiddenMarkersByDraggingCircles: () => set(() => ({}))
}))
