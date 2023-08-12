import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { environment } from "../../../environment";
import { getSession } from 'next-auth/react';

const baseURL: string = environment.urlConf + "/map";

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
        const defaultOptions = {
            baseURL,
        };
        const instance = axios.create(defaultOptions);
        instance.interceptors.request.use(async (request) => {
          const session = await getSession();
          if (session) request.headers.Authorization = `Bearer ${session.jwtToken}`;
          return request;
        });
        await instance.post(
          `${baseURL}/saveMarkersGeoJSON`,
          JSON.parse(markersGeoJSON)
        );
      },

      postLinestringsApi: async (linestringsGeoJSON: string, id: string) => {
        const defaultOptions = {
            baseURL,
        };
        const instance = axios.create(defaultOptions);
        instance.interceptors.request.use(async (request) => {
          const session = await getSession();
          if (session) request.headers.Authorization = `Bearer ${session.jwtToken}`;
          return request;
        });
        await instance.post(
          `${baseURL}/saveLineStringsGeoJSON/${id}`,
          JSON.parse(linestringsGeoJSON)
        );
      },

      postPolygonsApi: async (polygonsGeoJSON: string, id: string) => {
        const defaultOptions = {
            baseURL,
        };
        const instance = axios.create(defaultOptions);
        instance.interceptors.request.use(async (request) => {
          const session = await getSession();
          if (session) request.headers.Authorization = `Bearer ${session.jwtToken}`;
          return request;
        });
        await instance.post(
          `${baseURL}/savePolygonsGeoJSON/${id}`,
          JSON.parse(polygonsGeoJSON)
        );
      }
    }))
  )
);
