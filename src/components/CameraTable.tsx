'use client';
import React, { useState } from "react";
import { Api } from "@/services/api";
import { constants } from "@/utils/constants";

export default function CameraTable() {
  const [cameras, setCameras] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = new Api({ baseUrl: constants.API_URL });

  const fetchCameras = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.camaras.camarasList();
      setCameras(response.data);
    } catch (err) { 
      setError("Failed to fetch cameras");
    } finally {
      setLoading(false);
    }
  };

  function deleteCamara(name: string | undefined): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div>
      <button onClick={fetchCameras} disabled={loading}>
        {loading ? "Loading..." : "Get Cameras"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <table className="table-auto mt-4">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicacion</th>
            <th>URL</th>
            <th>Threshold</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cameras.map((camera) => (
            <tr key={camera.id}>
              <td>{camera.name}</td>
              <td>{camera.location}</td>
              <td>{camera.url}</td>
              <td>{camera.threshold}</td>
              <td>
                <button onClick={() => deleteCamara(camera.name)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
