import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { environment } from "@/environment";
import { IPerson } from "./Person";
import { getSession } from 'next-auth/react';

const baseURL: string = environment.urlConf + "/persons";

interface PersonsState {
  personsData: IPerson[];
  getApi: () => void;
  createPersonApi: (person: IPerson, token:string) => Promise<void>;
  updatePersonApi: (person: IPerson, ref: string, token:string) => Promise<void>;
  deletePersonApi: (id: string, token:string) => Promise<void>;
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

export const usePersonStore = create<PersonsState>()(
  immer(
    devtools((set) => ({
      personsData: [],
      getApi: async () => {
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
          state.personsData = apiResponse.data;
          state.personsData.map((person: IPerson, index: number) => {
            person["key"] = person["_id"];
            person["index"] = index;
            return person;
          });
        });
      },

      createPersonApi: async (person: IPerson, token:string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.post(baseURL, person);
        set((state) => {
          state.personsData.push(apiResponse.data);
          state.personsData.map((person: IPerson, index: number) => {
            person["key"] = person["_id"];
            person["index"] = index;
            return person;
          });
        });
      },

      updatePersonApi: async (person: IPerson, id: string, token:string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.put(baseURL + `/${id}`, person);
        set((state) => {
          let personState = state.personsData.filter(
            (person: IPerson) => person._id !== id
          );
          personState.push(apiResponse.data);
          state.personsData = personState;
          state.personsData.map((person: IPerson, index: number) => {
            person["key"] = person["_id"];
            person["index"] = index;
            return person;
          });
        });
      },

      deletePersonApi: async (id: string, token:string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        reqInstance.delete(baseURL + `/${id}`);
        set((state) => {
          state.personsData = state.personsData.filter(
            (_: IPerson) => _._id !== id
          );
        });
      }
    }))
  )
);
