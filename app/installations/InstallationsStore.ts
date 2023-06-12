import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { environment } from "@/environment";
import { IInstallation } from "./Installation";

const URL: string = environment.urlConf + "/installations";

interface InstallationsState {
  installationsData: IInstallation[];
  getApi: (token:string) => void;
  createInstallationApi: (installation: IInstallation, token:string) => Promise<void>;
  updateInstallationApi: (
    installation: IInstallation,
    ref: string,
    token:string
  ) => Promise<void>;
  deleteInstallationApi: (id: string, token:string) => Promise<void>;
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

export const useInstallationStore = create<InstallationsState>()(
  immer(
    devtools((set) => ({
      installationsData: [],
      getApi: async (token:string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.get(URL);
        set((state) => {
          state.installationsData = apiResponse.data;
          state.installationsData.map(
            (installation: IInstallation, index: number) => {
              installation["key"] = installation["_id"];
              installation["index"] = index;
              return installation;
            }
          );
        });
      },

      createInstallationApi: async (installation: IInstallation, token:string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.post(URL, installation);
        set((state) => {
          state.installationsData.push(apiResponse.data);
          state.installationsData.map(
            (installation: IInstallation, index: number) => {
              installation["key"] = installation["_id"];
              installation["index"] = index;
              return installation;
            }
          );
        });
      },

      updateInstallationApi: async (
        installation: IInstallation,
        id: string,
        token:string
      ) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.put(URL + `/${id}`, installation);
        set((state) => {
          let installationState = state.installationsData.filter(
            (installation: IInstallation) => installation._id !== id
          );
          installationState.push(apiResponse.data);
          state.installationsData = installationState;
          state.installationsData.map(
            (installation: IInstallation, index: number) => {
              installation["key"] = installation["_id"];
              installation["index"] = index;
              return installation;
            }
          );
        });
      },

      deleteInstallationApi: async (id: string, token: string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        reqInstance.delete(URL + `/${id}`);
        set((state) => {
          state.installationsData = state.installationsData.filter(
            (_: IInstallation) => _._id !== id
          );
        });
      }
    }))
  )
);
