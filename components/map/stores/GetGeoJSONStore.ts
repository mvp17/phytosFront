import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { IMarkerSchema } from "../interfaces/markerSchema";
import { IPolygonSchema } from "../interfaces/polygonSchema";
import { ILineStringSchema } from "../interfaces/linestringSchema";
import axios from "axios";
import { environment } from "../../../environment";
import { getSession } from 'next-auth/react';

const baseURL: string = environment.urlConf + "/map";

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
        const defaultOptions = {
          baseURL,
        };
        const instance = axios.create(defaultOptions);
        instance.interceptors.request.use(async (request) => {
          const session = await getSession();
          if (session) request.headers.Authorization = `Bearer ${session.jwtToken}`;
          return request;
        })
        const apiResponse = await instance.get(
          `${baseURL}/openGeoJSONMarkers/${id}`
        );
        set((state) => {
          state.markersData = apiResponse.data;
        });
      },

      getInstallationPolygonsApi: async (id: string) => {
        const defaultOptions = {
          baseURL,
        };
        const instance = axios.create(defaultOptions);
        instance.interceptors.request.use(async (request) => {
          const session = await getSession();
          if (session) request.headers.Authorization = `Bearer ${session.jwtToken}`;
          return request;
        });
        const apiResponse = await instance.get(
          `${baseURL}/openGeoJSONPolygons/${id}`
        );
        set((state) => {
          state.polygonsData = apiResponse.data;
        });
      },

      getInstallationLinestringsApi: async (id: string) => {
        const defaultOptions = {
          baseURL,
        };
        const instance = axios.create(defaultOptions);
        instance.interceptors.request.use(async (request) => {
          const session = await getSession();
          if (session) request.headers.Authorization = `Bearer ${session.jwtToken}`;
          return request;
        });
        const apiResponse = await instance.get(
          `${baseURL}/openGeoJSONLineStrings/${id}`
        );
        set((state) => {
          state.linestringsData = apiResponse.data;
        });
      }
    }))
  )
);
