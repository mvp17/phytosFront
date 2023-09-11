"use client";

import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import { useSeasonStore } from "../seasons/SeasonsStore";
import { useProductStore } from "../products/ProductsStore";
import { useInstallationStore } from "../installations/InstallationsStore";
import { useClientStore } from "../clients/ClientsStore";
import { useDashboardStore } from "./DashboardStore";
import { PieChart } from "../../components/PieChart";
import * as L from 'leaflet';
import * as turf from '@turf/turf';
import JSZip from 'jszip';
import { Card, 
         TabList, 
         Tab, 
         TabGroup, 
         TabPanels, 
         TabPanel,
         Accordion, 
         AccordionHeader, 
         AccordionBody, 
         Select,
         SelectItem,
         Button,
         Badge
        } from "@tremor/react";
import { IInstallation } from "../installations/Installation";
import { IMarkerSchema } from "@/components/map/interfaces/markerSchema";
import { IPolygonSchema } from "@/components/map/interfaces/polygonSchema";
import { IProduct } from "../products/Product";
import { getLatLngFromPolygon } from "@/components/map/utils/getLatLngFromPolygon";

type dataChart = {
    name: string,
    value: number
}[];

const DashboardPage = () => {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/dashboard');
        }
    });
    let usedProducts: dataChart = [];
    let spaceForVariety: dataChart = [];
    const [resultDownloadInstallForm, setResultDownloadInstallForm] = useState<"ok" | "ko" | null>(null);
    const [selectedSeason, setSelectedSeason] = useState("");
    const [selectedClient, setSelectedClient] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");

    const [selectedSeasonCharts, setSelectedSeasonCharts] = useState("");
    const [usedProductsChartData, setUsedProductsChartData] = useState<dataChart>([]);
    const [usedProductsChartVisible, setUsedProductsChartVisible] = useState<"ok" | "ko" | null>(null);
    const [spaceForVarietyChartData, setSpaceForVarietyChartData] = useState<dataChart>([]);
    const [spaceForVarietyChartVisible, setSpaceForVarietyChartVisible] = useState<"ok" | "ko" | null>(null);

    const allSeasons = useSeasonStore((state) => state.seasonsData);
    const getSeasons = useSeasonStore((state) => state.getAll);
    const allProducts = useProductStore((state) => state.productsData);
    const getProducts = useProductStore((state) => state.getAll);
    const allClients = useClientStore((state) => state.clientsData);
    const getClients = useClientStore((state) => state.getAll);
    const allInstallations = useInstallationStore((state) => state.installationsData);
    const getInstallations = useInstallationStore((state) => state.getAll);
    const allMarkers = useDashboardStore((state) => state.markers);
    const getAllMarkers = useDashboardStore((state) => state.getAllMarkers);
    const allPolygons = useDashboardStore((state) => state.polygons);
    const getAllPolygons = useDashboardStore((state) => state.getAllPolygons);
    
    useEffect(() => {
        getSeasons();
        getProducts();
        getClients();
        getInstallations();
        getAllMarkers();
        getAllPolygons();
    }, []);

    const handleDownloadInstallationDataSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setResultDownloadInstallForm(null);
        
        const form = event.target as HTMLFormElement;
        
        if (!selectedClient || !selectedSeason || !selectedProduct)
          return setResultDownloadInstallForm("ko")

        setResultDownloadInstallForm("ok");
        downloadInstallationDataAsZip(selectedClient, selectedSeason, selectedProduct);
        form.reset()
    }

    const downloadInstallationDataAsZip = (client: string, season: string, product: string) => {
        let zip = JSZip();
        let installations: IInstallation[] = [];
        
        installations = allInstallations.filter(
        (installation: IInstallation) => installation.clientName === client && installation.productName === product &&
                                        installation.seasonYear.toString() === season.toString());
        installations.forEach((installation: IInstallation) => {
            let installationDataFile: string = createTextFileWithInstallationData(installation);
            // @ts-ignore
            zip.folder(installation.name).file("Informació de la instal·lació.txt", installationDataFile);
            let installationGPX: string = createGPXFileFrom(installation);
            // @ts-ignore
            zip.folder(installation.name).file("Distribució dels " + installation.productName + ".gpx", installationGPX);
        });
        zip.generateAsync({type:"base64"})
            .then(function(content) {
                const url: string = "data:application/zip;base64," + content;
                const link: HTMLAnchorElement = document.createElement('a');
                link.download = season + '__' + client + '__' + product;
                link.href = url;
                document.body.appendChild(link);
                link.click();
            });
    }

    const createTextFileWithInstallationData = (installation: IInstallation): string => {
        let result = "Name: " + installation.name + '\n';
        result += "Used product: " + installation.productName + '\n';
        result += "Year: " + installation.seasonYear.toString() + '\n';
        result += "Client: " + installation.clientName + '\n';
        result += "Installation contacts: ";
        installation.contacts.forEach((contact: string) => {
        result += contact + ";";
        });
        result += '\n';
        result += "Plantations: " + installation.plantationName + '\n';
        result += "Plots: " + installation.plotName + '\n';
        result += "Installation date: " + installation.installationDate + '\n';
        result += "Activation date: " + installation.activationDate + '\n';
        result += "Province: " + installation.province + '\n';
        result += "Municipality: " + installation.municipality + '\n';
        result += "Features: " + installation.plantationName + '\n';
        result += "Projection observations: " + installation.projectionObservations + '\n';
        result += "Installation observations: " + installation.installationObservations + '\n';
        result += "Revision observations: " + installation.revisionObservations + '\n';
        result += "Retreat observations: " + installation.retreatObservations + '\n';
        
        return result;
    }

    const createGPXFileFrom = (installation: IInstallation): string => {
        let result: string = '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="opennatur"><metadata/>';
        result += '\n';
        const markers: IMarkerSchema[] = allMarkers.filter((marker: IMarkerSchema) => marker.idInstallation === installation._id);
        markers.forEach((markerSchema: IMarkerSchema) => {
            result += '<wpt ' + `lat="${markerSchema.coordinates[0]}" lon="${markerSchema.coordinates[1]}"` + '>' + '</wpt>' + '\n';
        });
        result += '</gpx>';

        return result;
    }

    const handleUsedProductsChartSubmit = () => {
        usedProducts = [];
        let labelsAndData = new Map<string, number>();

        if (!selectedSeasonCharts)
            alert("No season selected!");
        else {
            allInstallations.filter(
                (installation: IInstallation) => installation.seasonYear.toString() === selectedSeasonCharts.toString()
            );
            if (allInstallations.length === 0)
                alert("There are no installed products during that year.");
            else {
                allInstallations.forEach((installation: IInstallation) => {
                    if ([...labelsAndData.keys()].includes(installation.productName))
                        //@ts-ignore
                        labelsAndData.set(installation.productName, labelsAndData.get(installation.productName) + 1);
                    else
                        labelsAndData.set(installation.productName, 1);
                });
            }
            for (let [key, value] of labelsAndData) {
                usedProducts.push({name: key, value: value});
            }
            setUsedProductsChartData(usedProducts);
            setUsedProductsChartVisible("ok");
        }
    }

    const handleSpaceForVarietyChartSubmit = () => {
        spaceForVariety = [];
        let labelsAndData = new Map<string, number>();

        if (!selectedSeasonCharts)
            alert("No season selected!");
        else
            allInstallations.forEach((installation: IInstallation) => {
                let installationPolygons: IPolygonSchema[] = getPolygonsFromInstallation(installation._id);
                let variety: string = getVarietyFromProduct(installation.productName);
          
                if ([...labelsAndData.keys()].includes(variety))
                    // @ts-ignore
                    labelsAndData.set(variety, updateHa(installationPolygons, labelsAndData.get(variety)));
                else
                    labelsAndData.set(variety, getAreaPolygons(installationPolygons));
            })        
        if (!areThereAnyAreas([...labelsAndData.values()]))
            alert("There are no saved polygons for this year.");
        else {
            for (let [key, value] of labelsAndData) {
                spaceForVariety.push({name: key, value: value});
            }
            setSpaceForVarietyChartData(spaceForVariety);
            setSpaceForVarietyChartVisible("ok");
        }
    }

    const areThereAnyAreas = (areas: number[]): boolean => {
        let isArea: boolean = false;
        areas.forEach((area: number) => {
        if (area !== 0) isArea = true;
        });
        return isArea;
    }

    const getPolygonsFromInstallation = (id: string) => {
        return allPolygons.filter((polygon: IPolygonSchema) => polygon.idInstallation === id);
    }

    const getVarietyFromProduct = (productName: string): string => {
        let varieties: string = "";
        allProducts.forEach((product: IProduct) => {
            if (productName === product.commonName)
                varieties = product.affectedVariety
        });
        return varieties;
    }

    const updateHa = (installationPolygons: IPolygonSchema[], oldHa: number): number => {
        return oldHa + getAreaPolygons(installationPolygons);
    }

    const getAreaPolygons = (installationPolygons: IPolygonSchema[]) => {
        let resultArea: number = 0;
        installationPolygons.forEach((polygon: IPolygonSchema) => {
            const latLngExpression: L.LatLngExpression[] = getLatLngFromPolygon(polygon);
            const polygonToMap: L.Polygon = L.polygon(latLngExpression);
            const area: number = turf.area(polygonToMap.toGeoJSON()) / 10000;
            resultArea += area;
        });
        return resultArea;
    }
    
    return(
        <Fragment>
            <Card>
                <TabGroup>
                    <TabList className="mt-8">
                    <Tab>Installation data</Tab>
                    <Tab>Charts</Tab>
                    </TabList>
                    <TabPanels>
                    <TabPanel>
                        <form onSubmit={handleDownloadInstallationDataSubmit} className="">
                            <div>
                            <Select placeholder="Select Season" value={selectedSeason} onValueChange={setSelectedSeason}>
                                {
                                    allSeasons.map(season => 
                                    <SelectItem key={season.key} value={season.year.toString()}>
                                        {season.year}
                                    </SelectItem>
                                    )
                                }
                            </Select>
                            <Select placeholder="Select Client" value={selectedClient} onValueChange={setSelectedClient}>
                                {
                                    allClients.map(client => 
                                    <SelectItem key={client.key} value={client.name}>
                                        {client.name}
                                    </SelectItem>
                                    )
                                }
                            </Select>
                            <Select placeholder="Select Product" value={selectedProduct} onValueChange={setSelectedProduct}>
                                {
                                    allProducts.map(product => 
                                    <SelectItem key={product.key} value={product.commonName}>
                                        {product.commonName}
                                    </SelectItem>
                                    )
                                }
                            </Select>
                            <Button size="lg" type="submit" style={{ marginTop: "16px" }}>Download data zipped</Button>
                            <span>
                                {resultDownloadInstallForm === "ok" && (
                                <Badge color="green" style={{ marginLeft: "16px" }}>Correctly inputted</Badge>
                                )}
                                {resultDownloadInstallForm === "ko" && <Badge color="red" style={{ marginLeft: "16px" }}>Fields error</Badge>}
                            </span>
                            </div>
                        </form>
                    </TabPanel>
                    <TabPanel>
                        <Select placeholder="Select Season" value={selectedSeasonCharts} onValueChange={setSelectedSeasonCharts}>
                            {
                                allSeasons.map(season => 
                                    <SelectItem key={season.key} value={season.year.toString()}>
                                        {season.year}
                                    </SelectItem>
                                )
                            }
                        </Select>                        
                        <Accordion defaultOpen = {true}>
                            <AccordionHeader>Used Products</AccordionHeader>
                            <AccordionBody>
                            <Button onClick={handleUsedProductsChartSubmit} size="lg" style={{ marginTop: "16px", marginBottom: "16px" }}>View chart</Button>
                                {usedProductsChartVisible === "ok" && (<PieChart data={usedProductsChartData}/>)}
                            </AccordionBody>
                        </Accordion>
                        <Accordion defaultOpen = {true}>
                            <AccordionHeader>Space For Variety</AccordionHeader>
                            <AccordionBody>
                            <Button onClick={handleSpaceForVarietyChartSubmit} size="lg" style={{ marginTop: "16px", marginBottom: "16px" }}>View chart</Button>
                                {spaceForVarietyChartVisible === "ok" && (<PieChart data={spaceForVarietyChartData}/>)}
                            </AccordionBody>
                        </Accordion>
                    </TabPanel>
                    </TabPanels>
                </TabGroup>
            </Card>
        </Fragment>
    );
}

export default DashboardPage;
