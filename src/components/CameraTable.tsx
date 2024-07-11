import { Api } from "@/services/api";
import { constants } from "@/utils/constants";

export default async function CameraTable(){
    const api = new Api({ baseUrl: constants.API_URL });
    const response = await api.camaras.camarasList();
    const cameras = response.data;

    function deleteCamara(name: string | undefined): void {
      throw new Error("Function not implemented.");
    }

    return (
      <table className="table-auto">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicacion</th>
            <th>URL</th>
            <th>Threshold</th>
          </tr>
        </thead>
        <tbody>
          {cameras.map((camera) => (
            <tr key={camera.id}>
              <td>{camera.name}</td>
              <td>{camera.location}</td>
              <td>{camera.url}</td>
              <td>{camera.threshold}</td>
              <td><button onClick={() => deleteCamara(camera.name)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
