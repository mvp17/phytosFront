import { IInstallation } from "@/app/installations/Installation";
import { create } from "zustand";

type ReportState = {
  installation: IInstallation;
  setInstallation: (newValue: IInstallation) => void;
  variety: string;
  setVariety: (newValue: string) => void;
  totalArea: string;
  setTotalArea: (newValue: string) => void;
  usedProduct: string;
  setUsedProduct: (newValue: string) => void;
  productsToInstall: string;
  setProductsToInstall: (newValue: string) => void;
  contactName: string[];
  setContactName: (newValue: string[]) => void;
  contactEmail: string[];
  setContactEmail: (newValue: string[]) => void;
  contactPhoneNumber: string[];
  setContactPhoneNumber: (newValue: string[]) => void;

}

export const useReportStore = create<ReportState>()((set) => ({
    installation: {} as IInstallation,
    setInstallation: (newValue: IInstallation) => set(() => ({ installation: newValue })),
    variety: "",
    setVariety: (newValue: string) => set(() => ({ variety: newValue })),
    totalArea: "",
    setTotalArea: (newValue: string) => set(() => ({ totalArea: newValue })),
    usedProduct: "",
    setUsedProduct: (newValue: string) => set(() => ({ usedProduct: newValue })),
    productsToInstall: "",
    setProductsToInstall: (newValue: string) => set(() => ({ productsToInstall: newValue })),
    contactName: [],
    setContactName: (newValue: string[]) => set(() => ({ contactName: newValue })),
    contactEmail: [],
    setContactEmail: (newValue: string[]) => set(() => ({ contactEmail: newValue })),
    contactPhoneNumber: [],
    setContactPhoneNumber: (newValue: string[]) => set(() => ({ contactPhoneNumber: newValue })),
}));
