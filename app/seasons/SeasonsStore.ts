import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { environment } from "@/environment";
import { ISeason } from "./Season";
import { getSession } from 'next-auth/react';

const baseURL: string = environment.urlConf + "/seasons";

interface SeasonsState {
  seasonsData: ISeason[];
  getAll: () => void;
  createSeason: (season: ISeason, token:string) => Promise<void>;
  updateSeason: (season: ISeason, ref: string, token:string) => Promise<void>;
  deleteSeason: (id: string, token:string) => Promise<void>;
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

export const useSeasonStore = create<SeasonsState>()(
  immer(
    devtools((set) => ({
      seasonsData: [],
      getAll: async () => {
        const defaultOptions = {
          baseURL,
        };
        const instance = axios.create(defaultOptions);
        instance.interceptors.request.use(async (request) => {
          const session = await getSession();
          if (session) request.headers.Authorization = `Bearer ${session.jwtToken}`;
          return request;
        })
        const apiResponse = await instance.get(baseURL);
        set((state) => {
          state.seasonsData = apiResponse.data;
          state.seasonsData.map((season: ISeason, index: number) => {
            season["key"] = season["_id"];
            season["index"] = index;
            return season;
          });
        });
      },

      createSeason: async (season: ISeason, token:string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.post(baseURL, season);
        set((state) => {
          state.seasonsData.push(apiResponse.data);
          state.seasonsData.map((season: ISeason, index: number) => {
            season["key"] = season["_id"];
            season["index"] = index;
            return season;
          });
        });
      },

      updateSeason: async (season: ISeason, id: string, token:string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.put(baseURL + `/${id}`, season);
        set((state) => {
          let seasonState = state.seasonsData.filter(
            (season: ISeason) => season._id !== id
          );
          seasonState.push(apiResponse.data);
          state.seasonsData = seasonState;
          state.seasonsData.map((season: ISeason, index: number) => {
            season["key"] = season["_id"];
            season["index"] = index;
            return season;
          });
        });
      },

      deleteSeason: async (id: string, token:string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        reqInstance.delete(baseURL + `/${id}`);
        set((state) => {
          state.seasonsData = state.seasonsData.filter(
            (_: ISeason) => _._id !== id
          );
        });
      }
    }))
  )
);
