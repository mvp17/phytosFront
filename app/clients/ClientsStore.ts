import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { environment } from "@/environment";
import { IClient } from "./Client";

const URL: string = environment.urlConf + "/clients";

interface ClientsState {
  clientsData: IClient[];
  getApi: (token:string) => void;
  createClientApi: (client: IClient, token: string) => Promise<void>;
  updateClientApi: (client: IClient, ref: string, token: string) => Promise<void>;
  deleteClientApi: (id: string, token: string) => Promise<void>;
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

export const useClientStore = create<ClientsState>()(
  immer(
    devtools((set) => ({
      clientsData: [],
      getApi: async (token: string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.get(URL);
        set((state) => {
          state.clientsData = apiResponse.data;
          state.clientsData.map(
            (client: IClient, index: number) => {
              client["key"] = client["_id"];
              client["index"] = index;
            }
          );
        });
      },

      createClientApi: async (client: IClient, token: string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.post(URL, client);
        set((state) => {
          state.clientsData.push(apiResponse.data);
          state.clientsData.map(
            (client: IClient, index: number) => {
              client["key"] = client["_id"];
              client["index"] = index;
            }
          );
        });
      },

      updateClientApi: async (client: IClient, id: string, token: string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.put(URL + `/${id}`, client);
        set((state) => {
          let clientState = state.clientsData.filter(
            (client: IClient) => client._id !== id
          );
          clientState.push(apiResponse.data);
          state.clientsData = clientState;
          state.clientsData.map(
            (client: IClient, index: number) => {
              client["key"] = client["_id"];
              client["index"] = index;
            }
          );
        });
      },

      deleteClientApi: async (id: string, token: string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        reqInstance.delete(URL + `/${id}`);
        set((state) => {
          state.clientsData = state.clientsData.filter((_: IClient) => _._id !== id);
        });
      }
    }))
  )
);
