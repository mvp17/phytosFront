import { Fragment, useState, useEffect } from "react";
import { MapContainer } from "react-leaflet";
import { GeomanWrapper } from "./Geoman";
import { Layers } from "./Layers";
import { Toolbar } from "./Toolbar";
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
import { useMapDataStore } from "./stores/MapDataStore";
import { Checkbox } from 'antd';


interface IProps {
  installation: IInstallation;
}



const MapComponent = ({ installation }: IProps) => {
    const [map, setMap] = useState(null);
    
    const [resultGeoSearch, setResultGeoSearch] = useState<"ok" | "ko" | null>(null);
    const [resultCadastreSearch, setResultCadastreSearch] = useState<"ok" | "ko" | null>(null);
    
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedMunicipality, setSelectedMunicipality] = useState("");
    
    const [productDensity, setProductDensity] = useState(0);
    const [productColor, setProductColor] = useState("");

    const allProducts = useProductStore((state) => state.productsData);
    const getAllProducts = useProductStore((state) => state.getAll);
    
    const allProvinces = useCadastreStore((state) => state.provinces);
    const getCadastreProvinces = useCadastreStore((state) => state.getCadastreProvinces);
    
    const allMunicipalities = useCadastreStore((state) => state.municipalities);
    const getCadastreMunicipalities = useCadastreStore((state) => state.getCadastreMunicipalities);
    
    const resetMunicipalities = useCadastreStore((state) => state.resetMunicipalities);
    
    const getNonProtectedCadastreData = useCadastreStore((state) => state.getNonProtectedData);

    let totalAreaPolygonsString = useMapDataStore((state) => state.totalAreaPolygonsString);
    let totalProducts = useMapDataStore((state) => state.totalProducts);
    let markedProducts = useMapDataStore((state) => state.markedProducts);
    let actionRadius = useMapDataStore((state) => state.actionRadius);
  
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
        const codes = {
          cpine: cpine,
          np: np,
          cmc: cmc,
          cm: cm,
          nm: nm
        }
        getNonProtectedCadastreData(codes, area, plot, map!);
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
          scrollWheelZoom={true}
          // @ts-ignore
          ref={setMap}
          style={{
            height: "500px",
            backgroundColor: "white",
            resize: "both",
            overflow: "auto"
          }}
        >
          <Layers />
          <GeomanWrapper productDensity={productDensity} productColor={productColor} />
          <Toolbar productDensity={productDensity} productColor={productColor} installation={installation}/>
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
                  <Text>Action Radius</Text>
                  <span>
                    {actionRadius && (
                      <Badge color="green" style={{ marginLeft: "16px" }}>Action radius enabled</Badge>
                    )}
                    {!actionRadius && <Badge color="red" style={{ marginLeft: "16px" }}>Action radius disabled</Badge>}
                  </span>
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
