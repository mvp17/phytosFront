import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteGeoJSONStore } from "../stores/DeleteGeoJSONStore";
import { IInstallation } from "@/app/installations/Installation";

export function DeleteGeoJSONElementsButton({
  installation
}: {
  installation: IInstallation;
}) {
  const deleteGeoJSONApi = useDeleteGeoJSONStore(
    (state) => state.deleteGeoJSON
  );

  const deleteElements = () => {
    alert("Vols eliminar la distribució vella de la instal·lació/projecció?");
    if (window.confirm("OK: Sí.\nCancel: No.")) {
      deleteGeoJSONApi(installation._id);
      //let messageFromBackendStringified = JSON.stringify(res);
      //let messageFromBackendJSONParsed = JSON.parse(messageFromBackendStringified);
      //this.toastr.warning(messageFromBackendJSONParsed.message);
    }
  };

  return (
    <Tooltip title="Delete data">
      <Button onClick={deleteElements}>
        <DeleteIcon />
      </Button>
    </Tooltip>
  );
}
