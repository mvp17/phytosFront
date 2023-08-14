import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { IProvXML } from "../interfaces/provinceXML";
import { IMunXML } from "../interfaces/municipalityXML";
import axios from "axios";
import { environment } from "@/environment";
import { getSession } from 'next-auth/react';
import * as L from "leaflet";

const baseURL: string = environment.urlConf + "/map";

type CadastreCodes = {
  cpine: string,
  np: string,
  cmc: string,
  cm: string,
  nm: string,
}
interface CadastreState {
  provinces: IProvXML[];
  municipalities: IMunXML[];
  cadastreSearchResultCoordinates: string[],
  getCadastreProvinces: () => Promise<void>;
  resetMunicipalities: () => void;
  getCadastreMunicipalities: (provinceCode: string) => Promise<void>;
  getNonProtectedData: (codes: CadastreCodes, area: string, plot: string, map: L.Map) => Promise<void>;
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

export const useCadastreStore = create<CadastreState>()(
  immer(
    devtools((set) => ({
      provinces: [],
      municipalities: [],
      cadastreSearchResultCoordinates: [],
      getCadastreProvinces: async () => {
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
          baseURL + '/getCatastroProvinces/'
        );
        set((state) => {
          state.provinces = apiResponse.data;
        });
      },
      resetMunicipalities: () => {
        set((state) => {
          state.municipalities = [];
        });
      },
      getCadastreMunicipalities: async (provinceCode: string) => {
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
          baseURL + `/getCatastroMunicipalities/${provinceCode}`
        );
        set((state) => {
          state.municipalities = apiResponse.data;
        });
      },
      getNonProtectedData: async (codes: CadastreCodes, area: string, plot: string, map: L.Map) => {
        const defaultOptions = {
          baseURL,
        };
        const instance = axios.create(defaultOptions);
        instance.interceptors.request.use(async (request) => {
          const session = await getSession();
          if (session) request.headers.Authorization = `Bearer ${session.jwtToken}`;
          return request;
        });
        const params = {
          provinceCode: codes.cpine,
          province: codes.np,
          municipalityCode: codes.cmc,
          INEMunicipalityCode: codes.cm,
          municipality: codes.nm,
          area: area,
          plot: plot
        };
        const apiResponse = await instance.get(baseURL + "/getNonProtectedCatastroData", { params });
        set((state) => {
          state.cadastreSearchResultCoordinates = apiResponse.data;
          const lat = state.cadastreSearchResultCoordinates[1];
          const lon = state.cadastreSearchResultCoordinates[0];
          const coordinates = L.latLng(Number(lat), Number(lon));
          // It appears that 18 is the maximum zoom leaflet is able to show on the map.
          map.flyTo(coordinates, 18);
        });
      }
    }))
  )
);
