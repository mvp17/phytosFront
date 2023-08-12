import { Fragment, useState, useEffect } from "react";
import { MapContainer } from "react-leaflet";
import GeomanWrapper from "./Geoman";
import { Layers } from "./Layers";
import Toolbar from "./Toolbar";
import { IProduct } from "@/app/products/Product";
import { useProductStore } from "@/app/products/ProductsStore";
import { useCadastreStore } from "./stores/CadastreStore";
import { IInstallation } from "@/app/installations/Installation";
import { AccordionList, 
         Accordion, 
         AccordionHeader, 
         AccordionBody, 
         Grid, 
         Button,
         Metric, 
         Text,
         NumberInput,
         Badge
        } from "@tremor/react";
import SearchIcon from '@mui/icons-material/Search';
import { message } from "antd";
import * as L from "leaflet";
import {
  Select,
  SelectItem,
} from "@tremor/react";
import { IProvXML } from "./interfaces/provinceXML";
import { IMunXML } from "./interfaces/municipalityXML";
import { environment } from "@/environment";
import axios from "axios";
import { getSession } from "next-auth/react";


interface IProps {
  installation: IInstallation;
}

const MapComponent = ({ installation }: IProps) => {
    const [idForMarkers, setIdForMarkers] = useState(0);
    const [map, setMap] = useState(null);
    const [resultGeoSearch, setResultGeoSearch] = useState<"ok" | "ko" | null>(null);
    const [resultCadastreSearch, setResultCadastreSearch] = useState<"ok" | "ko" | null>(null);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedMunicipality, setSelectedMunicipality] = useState("");
    const [actionRadius, setActionRadius] = useState(false);
    const [totalAreaPolygons, setTotalAreaPolygons] = useState(0);
    const [totalAreaPolygonsString, setTotalAreaPolygonsString] = useState("0");
    const [totalProducts, setTotalProducts] = useState(0);
    const [markedProducts, setMarkedProducts] = useState(0);
    const hiddenMarkersByDraggingCircles: Map<string, number[]> = new Map<
      string,
      number[]
    >();
    const [productDensity, setProductDensity] = useState(0);
    const [productColor, setProductColor] = useState("");

    const allProducts = useProductStore((state) => state.productsData);
    const getAllProducts = useProductStore((state) => state.getAll);
    const allProvinces = useCadastreStore((state) => state.provinces);
    const getCadastreProvinces = useCadastreStore((state) => state.getCadastreProvinces);
    const allMunicipalities = useCadastreStore((state) => state.municipalities);
    const getCadastreMunicipalities = useCadastreStore((state) => state.getCadastreMunicipalities);
    const resetMunicipalities = useCadastreStore((state) => state.resetMunicipalities);
    //const responseNonProtectedCadastre = useCadastreStore((state) => state.responseNonProtectedCadastre);
    //const getNonProtectedCadastreData = useCadastreStore((state) => state.getNonProtectedCadastreData);

    const polygonColor = "#FFFB89";
  
    const setProductInfoByProductNameFrom = (products: IProduct[]) => {
      if (products.length === 0) alert("No hi ha productes registrats!");
      else {
        products.forEach((product: IProduct) => {
          if (product.commonName === installation.productName) {
            setProductDensity(product.productDensityPerHectare);
            setProductColor(product.color);
          }
        });
        /*
        if (productDensity === 0)
          alert(
            "No hi ha cap producte registrat amb el nom de producte donat. " +
              "Pertant, no hi ha densitat per hectarea associada."
          );
        */
      }
    };
  
    useEffect(() => {
      getAllProducts();
      setProductInfoByProductNameFrom(allProducts);
      getCadastreProvinces();
    }, [productDensity, productColor, selectedProvince]);
  
    const geomanProps = {
      polygonColor: polygonColor,
      idForMarkers: idForMarkers,
      setIdForMarkers: setIdForMarkers,
      actionRadius: actionRadius,
      setActionRadius: setActionRadius,
      productDensity: productDensity,
      productColor: productColor,
      hiddenMarkersByDraggingCircles: hiddenMarkersByDraggingCircles,
      totalAreaPolygons: totalAreaPolygons,
      setTotalAreaPolygons: setTotalAreaPolygons,
      totalAreaPolygonsString: totalAreaPolygonsString,
      setTotalAreaPolygonsString: setTotalAreaPolygonsString,
      totalProducts: totalProducts,
      setTotalProducts: setTotalProducts,
      markedProducts: markedProducts,
      setMarkedProducts: setMarkedProducts
    };
  
    const toolbarProps = {
      idForMarkers: idForMarkers,
      setIdForMarkers: setIdForMarkers,
      actionRadius: actionRadius,
      setActionRadius: setActionRadius,
      hiddenMarkersByDraggingCircles: hiddenMarkersByDraggingCircles,
      productDensity: productDensity,
      productColor: productColor,
      installation: installation,
      polygonColor: polygonColor,
      totalAreaPolygons: totalAreaPolygons,
      setTotalAreaPolygons: setTotalAreaPolygons,
      setTotalAreaPolygonsString: setTotalAreaPolygonsString,
      setTotalProducts: setTotalProducts,
      setMarkedProducts: setMarkedProducts
    };

    const handleGeographicSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setResultGeoSearch(null);
      
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      const lat = formData.get("lat") as string;
      const lon = formData.get("lon") as string;
      
      if (!lat || !lon) {
        return setResultGeoSearch("ko")
      }
      setResultGeoSearch("ok")
      searchGeoPositionOnMap(Number(lat), Number(lon))
      form.reset()
    }

    const searchGeoPositionOnMap = (lat: number, lon: number) => {
      const coordinates = L.latLng(lat, lon);
      // @ts-ignore
      map.flyTo(coordinates);
    }

    const handleCadastreSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      const baseURL: string = environment.urlConf + "/map";
      event.preventDefault();
      setResultCadastreSearch(null);
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const area = formData.get("area") as string;
      const plot = formData.get("plot") as string;
      let cpine = "";
      let np = "";
      let cmc = "";
      let cm = "";
      let nm = "";

      allProvinces.map((province) => {
        if (selectedProvince === province.cpine){
          cpine = province.cpine;
          np = province.np;
        }
      });
      allMunicipalities.map((municipality) => {
        if (selectedMunicipality === municipality.nm){
          cmc = municipality.locat.cmc;
          cm = municipality.loine.cm;
          nm = municipality.nm;
        }
      });

      if (cpine !== "" && np !== "" && cmc !== "" && cm !== "" && nm !== ""){
          const defaultOptions = {
              baseURL,
          };
          const instance = axios.create(defaultOptions);
          instance.interceptors.request.use(async (request) => {
            const session = await getSession();
            if (session) request.headers.Authorization = `Bearer ${session.jwtToken}`;
            return request;
          });
          const params = {
            provinceCode: cpine,
            province: np,
            municipalityCode: cmc,
            INEMunicipalityCode: cm,
            municipality: nm,
            area: area,
            plot: plot
          };
          const apiResponse = await instance.get(baseURL + "/getNonProtectedCatastroData", { params })
          const response = apiResponse.data;
          const lat = response[1];
          const lon = response[0];

          const coordinates = L.latLng(Number(lat), Number(lon));
          // It appears that 18 is the maximum zoom leaflet is able to show on the map.
          // @ts-ignore
          map.flyTo(coordinates, 18);
      }
      else
          message.error("Error in getting cadastre params.");
    }

    const handleOnProvinceChange = (cpine: string) => {
      setSelectedProvince(cpine)
      resetMunicipalities();
      getCadastreMunicipalities(cpine);
    }

    const handleOnMunicipalityChange = (nm: string) => {
      setSelectedMunicipality(nm);
    }
  
    return (
      <Fragment>
        <MapContainer
          center={[40.463667, -3.74922]}
          zoom={7}
          scrollWheelZoom={false}
           // @ts-ignore
          ref={setMap}
          style={{
            height: "500px",
            backgroundColor: "white",
            resize: "both",
            overflow: "auto"
          }}
        >
          <GeomanWrapper props={geomanProps} />
          <Layers />
          <Toolbar props={toolbarProps} />
        </MapContainer>
        <Grid numItems={1} numItemsSm={3} numItemsLg={3}>
          <AccordionList>
            <Accordion defaultOpen={true}>
              <AccordionHeader>Map Info</AccordionHeader>
                <AccordionBody>
                  <Text>Total area</Text>
                  <Metric>{totalAreaPolygonsString} ha</Metric>
                  <Text>Total {installation.productName}s</Text>
                  <Metric>{totalProducts}</Metric>
                  <Text>Total {installation.productName}s marked on the map</Text>
                  <Metric>{markedProducts}</Metric>
                </AccordionBody>
            </Accordion>
            <Accordion defaultOpen={true}>
              <AccordionHeader>Installation Info</AccordionHeader>
                <AccordionBody>
                  <Text>Plantation</Text>
                  <Metric>{installation.plantationName}</Metric>
                  <Text>Plot</Text>
                  <Metric>{installation.plotName}</Metric>
                  <Text>Season</Text>
                  <Metric>{installation.seasonYear}</Metric>
                  <Text>Product</Text>
                  <Metric>{installation.productName}</Metric>
                </AccordionBody>
            </Accordion>
          </AccordionList>
          <AccordionList>
            <Accordion>
              <AccordionHeader>Geographic Search</AccordionHeader>
                <AccordionBody>
                  <form onSubmit={handleGeographicSearchSubmit} className="">
                    <NumberInput icon={SearchIcon} name="lat" placeholder="Lat (xx,xxxxx)" />
                    <NumberInput icon={SearchIcon} name="lon" placeholder="Lon (xx,xxxxx)" />
                    <div>
                      <Button size="lg" type="submit" style={{ marginTop: "16px" }}>Confirm search</Button>
                      <span>
                        {resultGeoSearch === "ok" && (
                          <Badge color="green" style={{ marginLeft: "16px" }}>Correctly saved</Badge>
                        )}
                        {resultGeoSearch === "ko" && <Badge color="red" style={{ marginLeft: "16px" }}>Fields error</Badge>}
                      </span>
                    </div>
                  </form>
                </AccordionBody>
            </Accordion>
            <Accordion>
              <AccordionHeader>Cadastre Search</AccordionHeader>
                <AccordionBody>
                  <form onSubmit={handleCadastreSearchSubmit} className="">
                    <Select placeholder="Select province" value={selectedProvince} onValueChange={handleOnProvinceChange}>
                      {
                        allProvinces.map(province => 
                          <SelectItem key={province.cpine} value={province.cpine}>
                            {province.np}
                          </SelectItem>
                        )
                      }
                    </Select>
                    <Select placeholder="Select municipality" value={selectedMunicipality} onValueChange={handleOnMunicipalityChange}>
                      {
                        allMunicipalities.map(municipality => 
                          <SelectItem key={municipality.nm} value={municipality.nm}>
                            {municipality.nm}
                          </SelectItem>
                        )
                      }
                    </Select>
                    <NumberInput name="area" placeholder="Area" />
                    <NumberInput name="plot" placeholder="Plot" />
                    <div>
                      <Button size="lg" type="submit" style={{ marginTop: "16px" }}>Confirm search</Button>
                      <span>
                        {resultCadastreSearch === "ok" && (
                          <Badge color="green" style={{ marginLeft: "16px" }}>Correctly saved</Badge>
                        )}
                        {resultCadastreSearch === "ko" && <Badge color="red" style={{ marginLeft: "16px" }}>Fields error</Badge>}
                      </span>
                    </div>
                  </form>
                </AccordionBody>
            </Accordion>
          </AccordionList>
        </Grid>
      </Fragment>
    );
  };

  export default MapComponent;
  
