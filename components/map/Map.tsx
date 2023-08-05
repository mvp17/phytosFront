import { Fragment, useState, useEffect } from "react";
import { MapContainer } from "react-leaflet";
import GeomanWrapper from "./Geoman";
import { Layers } from "./Layers";
import Toolbar from "./Toolbar";
import { IProduct } from "@/app/products/Product";
import { useProductStore } from "@/app/products/ProductsStore";
import { IInstallation } from "@/app/installations/Installation";
import { AccordionList, Accordion, AccordionHeader, AccordionBody } from "@tremor/react";


interface IProps {
  installation: IInstallation;
}

const MapComponent = ({ installation }: IProps) => {
    const [idForMarkers, setIdForMarkers] = useState(0);
    const [actionRadius, setActionRadius] = useState(false);
    const [totalAreaPolygons, setTotalAreaPolygons] = useState(0);
    const [totalAreaPolygonsString, setTotalAreaPolygonsString] = useState("");
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
      console.log(productDensity, productColor)
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
        <AccordionList className="max-w-md mx-auto">
          <Accordion>
            <AccordionHeader>Accordion 1</AccordionHeader>
            <AccordionBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempor lorem non est
              congue blandit. Praesent non lorem sodales, suscipit est sed, hendrerit dolor.
            </AccordionBody>
          </Accordion>
          <Accordion>
            <AccordionHeader>Accordion 2</AccordionHeader>
            <AccordionBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempor lorem non est
              congue blandit. Praesent non lorem sodales, suscipit est sed, hendrerit dolor.
            </AccordionBody>
          </Accordion>
          <Accordion>
            <AccordionHeader>Accordion 3</AccordionHeader>
            <AccordionBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempor lorem non est
              congue blandit. Praesent non lorem sodales, suscipit est sed, hendrerit dolor.
            </AccordionBody>
          </Accordion>
        </AccordionList>
      </Fragment>
    );
  };

  export default MapComponent;
  