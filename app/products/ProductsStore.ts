import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { environment } from "@/environment";
import { IProduct } from "./Product";

const URL: string = environment.urlConf + "/products";

interface ProductsState {
  productsData: IProduct[];
  getApi: (token:string) => void;
  createProductApi: (product: IProduct, token:string) => Promise<void>;
  updateProductApi: (product: IProduct, ref: string, token:string) => Promise<void>;
  deleteProductApi: (id: string, token:string) => Promise<void>;
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

export const useProductStore = create<ProductsState>()(
  immer(
    devtools((set) => ({
      productsData: [],
      getApi: async (token:string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.get(URL);
        set((state) => {
          state.productsData = apiResponse.data;
          state.productsData.map((product: IProduct, index: number) => {
            product["key"] = product["_id"];
            product["index"] = index;
            return product;
          });
        });
      },

      createProductApi: async (product: IProduct, token:string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.post(URL, product);
        set((state) => {
          state.productsData.push(apiResponse.data);
          state.productsData.map((product: IProduct, index: number) => {
            product["key"] = product["_id"];
            product["index"] = index;
            return product;
          });
        });
      },

      updateProductApi: async (product: IProduct, id: string, token:string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apiResponse = await reqInstance.put(URL + `/${id}`, product);
        set((state) => {
          let productState = state.productsData.filter(
            (product: IProduct) => product._id !== id
          );
          productState.push(apiResponse.data);
          state.productsData = productState;
          state.productsData.map((product: IProduct, index: number) => {
            product["key"] = product["_id"];
            product["index"] = index;
            return product;
          });
        });
      },

      deleteProductApi: async (id: string, token:string) => {
        let reqInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        reqInstance.delete(URL + `/${id}`);
        set((state) => {
          state.productsData = state.productsData.filter(
            (_: IProduct) => _._id !== id
          );
        });
      }
    }))
  )
);
