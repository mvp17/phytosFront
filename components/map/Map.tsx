import { Fragment, useState, useEffect } from "react";
import { MapContainer } from "react-leaflet";
import GeomanWrapper from "./Geoman";
import { Layers } from "./Layers";
import Toolbar from "./Toolbar";
import { IProduct } from "@/app/products/Product";
import { useProductStore } from "@/app/products/ProductsStore";


interface IProps {
    installationId: string;
    productName: string;
}

const MapComponent = ({ installationId, productName }: IProps) => {
    const [idForMarkers, setIdForMarkers] = useState(0);
    const [actionRadius, setActionRadius] = useState(false);
    const hiddenMarkersByDraggingCircles: Map<string, number[]> = new Map<
      string,
      number[]
    >();
    const [productDensity, setProductDensity] = useState(0);
    const [productColor, setProductColor] = useState("");
  
    const allProducts = useProductStore((state) => state.productsData);
  
    const setProductInfoByProductNameFrom = (products: IProduct[]) => {
      if (products.length === 0) alert("No hi ha productes registrats!");
      else {
        products.forEach((product: IProduct) => {
          if (product.commonName === productName) {
            setProductDensity(product.productDensityPerHectare);
            setProductColor(product.color);
          }
        });
        if (productDensity === 0)
          alert(
            "No hi ha cap producte registrat amb el nom de producte donat. " +
              "Pertant, no hi ha densitat per hectarea associada."
          );
      }
    };
  
    useEffect(() => {
      //setProductInfoByProductNameFrom(allProducts);
    });
  
    return (
      <Fragment>
        <MapContainer
          center={[40.463667, -3.74922]}
          zoom={7}
          scrollWheelZoom={false}
          style={{
            height: "700px",
            backgroundColor: "white",
            resize: "both",
            //overflow: "auto"
          }}
        >
          <GeomanWrapper />
          <Layers />
          <Toolbar
            idForMarkers={idForMarkers}
            setIdForMarkers={setIdForMarkers}
            actionRadius={actionRadius}
            setActionRadius={setActionRadius}
            hiddenMarkersByDraggingCircles={hiddenMarkersByDraggingCircles}
            productDensity={productDensity}
            productColor={productColor}
          />
        </MapContainer>
      </Fragment>
    );
  };

  export default MapComponent;
  