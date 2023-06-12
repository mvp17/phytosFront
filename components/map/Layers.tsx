import { useMap } from "react-leaflet";
import * as L from "leaflet";

export function Layers() {
  const map = useMap();

  const defaultBase = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 20,
      minZoom: 3,
      maxNativeZoom: 20,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  );
  defaultBase.addTo(map);

  const topoBase = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 20,
      minZoom: 3,
      maxNativeZoom: 20,
      attribution:
        'Map data: <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }
  );

  const PNOAOrthoImageBase = L.tileLayer.wms(
    "https://www.ign.es/wms-inspire/pnoa-ma",
    {
      maxZoom: 20,
      minZoom: 3,
      maxNativeZoom: 20,
      layers: "OI.OrthoimageCoverage",
      format: "image/jpeg",
      transparent: true,
      version: "1.3.0",
      attribution:
        'PNOA cedido por © <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
    }
  );

  const spainAllIGNMapBase = L.tileLayer.wms(
    "http://www.ign.es/wms-inspire/ign-base",
    {
      maxZoom: 20,
      minZoom: 3,
      maxNativeZoom: 20,
      layers: "IGNBaseTodo",
      format: "image/png",
      transparent: false,
      attribution:
        '© <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
    }
  );

  const spainRasterMapsIGNBase = L.tileLayer.wms(
    "http://www.ign.es/wms-inspire/mapa-raster",
    {
      maxZoom: 20,
      minZoom: 3,
      maxNativeZoom: 20,
      layers: "mtn_rasterizado",
      format: "image/png",
      transparent: false,
      attribution:
        '© <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
    }
  );

  const spainCatastro = L.tileLayer.wms(
    "http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx",
    {
      maxZoom: 20,
      minZoom: 3,
      maxNativeZoom: 20,
      layers: "Catastro",
      format: "image/png",
      transparent: false,
      attribution:
        ' <a href="http://www.catastro.meh.es/" target="_blank">Dirección General del Catastro</a>'
    }
  );

  const spainUnidadAdministrativa = L.tileLayer.wms(
    "http://www.ign.es/wms-inspire/unidades-administrativas",
    {
      maxZoom: 20,
      minZoom: 3,
      maxNativeZoom: 20,
      layers: "AU.AdministrativeUnit",
      format: "image/png",
      transparent: true,
      attribution:
        '© <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
    }
  );

  // To add and remove tileLayers available on the map (top-right button)
  const baseLayers = {
    "Open Street Map": defaultBase,
    "Open Topo Map": topoBase,
    "PNOA Max. Actualidad": PNOAOrthoImageBase,
    "IGNE Base": spainAllIGNMapBase,
    "Cartografia Raster IGNE": spainRasterMapsIGNBase,
    "Cartografia Catastro": spainCatastro
  };

  const overLayers = {
    "Unidades administrativas": spainUnidadAdministrativa
  };

  // Top-right layers icon
  L.control.layers(baseLayers, overLayers).addTo(map);

  return null;
}
