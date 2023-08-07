import { Fragment, useState, useEffect } from "react";
import { MapContainer } from "react-leaflet";
import GeomanWrapper from "./Geoman";
import { Layers } from "./Layers";
import Toolbar from "./Toolbar";
import { IProduct } from "@/app/products/Product";
import { useProductStore } from "@/app/products/ProductsStore";
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


interface IProps {
  installation: IInstallation;
}

const MapComponent = ({ installation }: IProps) => {
    const [idForMarkers, setIdForMarkers] = useState(0);
    const [resultGeoSearch, setResultGeoSearch] = useState<"ok" | "ko" | null>(null);
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
    }, [productDensity, productColor]);
  
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
      console.log(lat, lon)
    }
  
    return (
      <Fragment>
        <MapContainer
          center={[40.463667, -3.74922]}
          zoom={7}
          scrollWheelZoom={false}
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
          </AccordionList>
          <AccordionList>
            <Accordion>
              <AccordionHeader>Geographic Search</AccordionHeader>
                <AccordionBody>
                  <form onSubmit={handleSubmit} className="">
                    <NumberInput icon={SearchIcon} name="lat" placeholder="Lat (xx,xxxxx)" />
                    <NumberInput icon={SearchIcon} name="lon" placeholder="Lon (xx,xxxxx)" />
                    <div>
                      <Button size="lg" type="submit" style={{ marginTop: "16px" }}>Confirm search</Button>
                      <span>
                        {resultGeoSearch === "ok" && (
                          <Badge>Correctly saved</Badge>
                        )}
                        {resultGeoSearch === "ko" && <Badge>Fields error</Badge>}
                      </span>
                    </div>
                  </form>
                </AccordionBody>
            </Accordion>
          </AccordionList>
          <AccordionList>
            <Accordion>
              <AccordionHeader>Cadastre Search</AccordionHeader>
                <AccordionBody>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempor lorem non est
                  congue blandit. Praesent non lorem sodales, suscipit est sed, hendrerit dolor.
                </AccordionBody>
            </Accordion>
          </AccordionList>
        </Grid>
      </Fragment>
    );
  };

  export default MapComponent;
  
