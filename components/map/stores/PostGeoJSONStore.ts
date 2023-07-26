import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { environment } from "../../../environment";

const URL: string = environment.urlConf + "/map";

interface GeoJSONState {
  postMarkersApi: (markersGeoJSON: string) => Promise<void>;
  postLinestringsApi: (linestringsGeoJSON: string, id: string) => Promise<void>;
  postPolygonsApi: (polygonsGeoJSON: string, id: string) => Promise<void>;
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

export const usePostGeoJSONStore = create<GeoJSONState>()(
  immer(
    devtools(() => ({
      postMarkersApi: async (markersGeoJSON: string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        });
        await reqInstance.post(
          `${URL}/saveMarkersGeoJSON`,
          JSON.parse(markersGeoJSON)
        );
      },

      postLinestringsApi: async (linestringsGeoJSON: string, id: string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        });
        await reqInstance.post(
          `${URL}/saveLineStringsGeoJSON/${id}`,
          JSON.parse(linestringsGeoJSON)
        );
      },

      postPolygonsApi: async (polygonsGeoJSON: string, id: string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        });
        await reqInstance.post(
          `${URL}/savePolygonsGeoJSON/${id}`,
          JSON.parse(polygonsGeoJSON)
        );
      }
    }))
  )
);
