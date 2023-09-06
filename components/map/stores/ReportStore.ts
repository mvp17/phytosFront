import { IInstallation } from "@/app/installations/Installation";
import { create } from "zustand";

type ReportState = {
  dataContacts: { items: string[][] };
  installation: IInstallation;
  dataInstallation: { items: string[][] };
  setDataContacts: (newValue: { items: string[][] }) => void;
  setInstallation: (newValue: IInstallation) => void;
  setDataInstallation: (newValue: { items: string[][] }) => void;
}

export const useReportStore = create<ReportState>()((set) => ({
    dataContacts: {} as {items: string[][]},
    installation: {} as IInstallation,
    dataInstallation: {} as {items: string[][]},
    setDataContacts: (newValue: { items: string[][] }) => set(() => ({ dataContacts: newValue })),
    setInstallation: (newValue: IInstallation) => set(() => ({ installation: newValue })),
    setDataInstallation: (newValue: { items: string[][] }) => set(() => ({ dataInstallation: newValue }))
}));
