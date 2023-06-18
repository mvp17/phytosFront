export interface IInstallation {
  _id: string;
  name: string;
  productName: string;
  seasonYear: number;
  clientName: string;
  plantationName: string;
  plotName: string;
  installationDate: string;
  activationDate: string;
  province: string;
  municipality: string;
  features: string;
  projectionObservations: string;
  installationObservations: string;
  revisionObservations: string;
  retreatObservations: string;
  contacts: string[];
  key: string;
  index: number;
}
