import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { environment } from "@/environment";
import { IPerson } from "./Person";

const URL: string = environment.urlConf + "/persons";

interface PersonsState {
  personsData: IPerson[];
  getApi: (token:string) => void;
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
      getApi: async (token:string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.get(URL);
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
        const apiResponse = await reqInstance.post(URL, person);
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
        const apiResponse = await reqInstance.put(URL + `/${id}`, person);
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
        reqInstance.delete(URL + `/${id}`);
        set((state) => {
          state.personsData = state.personsData.filter(
            (_: IPerson) => _._id !== id
          );
        });
      }
    }))
  )
);
