import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { IPolygonMap } from "../interfaces/polygonMap";

interface PolygonsState {
  polygonsData: IPolygonMap[];
  resetPolygons: () => void;
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

export const usePolygonsStore = create<PolygonsState>()(
  immer(
    devtools((set) => ({
      polygonsData: [],
      resetPolygons: () => {
        set((state) => {
          state.polygonsData = [];
        });
      }
    }))
  )
);
