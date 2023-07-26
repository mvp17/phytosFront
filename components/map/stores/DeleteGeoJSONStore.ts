import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { environment } from "../../../environment";

const URL: string = environment.urlConf + "/map";

interface GeoJSONState {
  deleteGeoJSON: (id: string) => Promise<void>;
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

export const useDeleteGeoJSONStore = create<GeoJSONState>()(
  immer(
    devtools(() => ({
      deleteGeoJSON: async (id: string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        });
        await reqInstance.delete(`${URL}/deleteGeoJSON/${id}`);
      }
    }))
  )
);
