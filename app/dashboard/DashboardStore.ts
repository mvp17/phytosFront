import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { environment } from "@/environment";
import { getSession } from 'next-auth/react';
import { IMarkerSchema } from "@/components/map/interfaces/markerSchema";
import { IPolygonSchema } from "@/components/map/interfaces/polygonSchema";

const baseURL: string = environment.urlConf + "/dashboard";

interface PersonsState {
    markers: IMarkerSchema[];
    polygons: IPolygonSchema[];
    getAllMarkers: () => void;
    getAllPolygons: () => void;
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

export const useDashboardStore = create<PersonsState>()(
    immer(
        devtools((set) => ({
            markers: [],
            polygons: [],
            getAllMarkers: async () => {
                const defaultOptions = {
                    baseURL,
                };
                const instance = axios.create(defaultOptions);
                instance.interceptors.request.use(async (request) => {
                    const session = await getSession();
                    if (session) request.headers.Authorization = `Bearer ${session.jwtToken}`;
                    return request;
                });
                const apiResponse = await instance.get(`${baseURL}/openGeoJSONMarkers`);
                set((state) => {
                    state.markers = apiResponse.data;
                  });
            },
            getAllPolygons: async () => {
                const defaultOptions = {
                    baseURL,
                };
                const instance = axios.create(defaultOptions);
                instance.interceptors.request.use(async (request) => {
                    const session = await getSession();
                    if (session) request.headers.Authorization = `Bearer ${session.jwtToken}`;
                    return request;
                });
                const apiResponse = await instance.get(`${baseURL}/openGeoJSONPolygons`);
                set((state) => {
                    state.polygons = apiResponse.data;
                  });
            },
        }))
    )
);
