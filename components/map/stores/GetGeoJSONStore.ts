import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { IMarkerSchema } from "../interfaces/markerSchema";
import { IPolygonSchema } from "../interfaces/polygonSchema";
import { ILineStringSchema } from "../interfaces/linestringSchema";
import axios from "axios";
import { environment } from "../../../environment";

const URL: string = environment.urlConf + "/map";

interface GeoJSONState {
  markersData: IMarkerSchema[];
  polygonsData: IPolygonSchema[];
  linestringsData: ILineStringSchema[];
  getInstallationMarkersApi: (id: string) => void;
  getInstallationPolygonsApi: (id: string) => void;
  getInstallationLinestringsApi: (id: string) => void;
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

export const useGetGeoJSONStore = create<GeoJSONState>()(
  immer(
    devtools((set) => ({
      markersData: [],
      polygonsData: [],
      linestringsData: [],
      getInstallationMarkersApi: async (id: string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        });
        const apiResponse = await reqInstance.get(
          `${URL}/openGeoJSONMarkers/${id}`
        );
        set((state) => {
          state.markersData = apiResponse.data;
        });
      },

      getInstallationPolygonsApi: async (id: string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        });
        const apiResponse = await reqInstance.get(
          `${URL}/openGeoJSONPolygons/${id}`
        );
        set((state) => {
          state.polygonsData = apiResponse.data;
        });
      },

      getInstallationLinestringsApi: async (id: string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        });
        const apiResponse = await reqInstance.get(
          `${URL}/openGeoJSONLineStrings/${id}`
        );
        set((state) => {
          state.linestringsData = apiResponse.data;
        });
      }
    }))
  )
);
