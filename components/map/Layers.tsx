import { WMSTileLayer } from "react-leaflet";
import {
  TileLayer,
  LayersControl
} from "react-leaflet";
import { Fragment } from "react";


export function Layers() {
  return (
    <Fragment>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Open Street Map">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Open Topo Map">
          <TileLayer
            attribution='Map data: <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="PNOA Max. Actualidad">
          <WMSTileLayer
            maxZoom={20}
            minZoom={3}
            maxNativeZoom={20}
            transparent={true}
            layers="OI.OrthoimageCoverage"
            format="image/jpeg"
            attribution='PNOA cedido por © <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
            url="https://www.ign.es/wms-inspire/pnoa-ma"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="IGNE Base">
          <WMSTileLayer
            maxZoom={20}
            minZoom={3}
            maxNativeZoom={20}
            transparent={false}
            layers="IGNBaseTodo"
            format="image/png"
            attribution='© <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
            url="http://www.ign.es/wms-inspire/ign-base"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Cartografia Raster IGNE">
          <WMSTileLayer
            maxZoom={20}
            minZoom={3}
            maxNativeZoom={20}
            transparent={false}
            layers="mtn_rasterizado"
            format="image/png"
            attribution='© <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
            url="http://www.ign.es/wms-inspire/mapa-raster"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Cartografia Catastro">
          <WMSTileLayer
            maxZoom={20}
            minZoom={3}
            maxNativeZoom={20}
            transparent={false}
            layers="Catastro"
            format="image/png"
            attribution='<a href="http://www.catastro.meh.es/" target="_blank">Dirección General del Catastro</a>'
            url="http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx"
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay name="Unidades administrativas">
          <WMSTileLayer
              maxZoom={20}
              minZoom={3}
              maxNativeZoom={20}
              transparent={true}
              layers="AU.AdministrativeUnit"
              format="image/png"
              attribution='© <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
              url="http://www.ign.es/wms-inspire/unidades-administrativas"
            />
        </LayersControl.Overlay>
      </LayersControl>
    </Fragment>
    )
}
