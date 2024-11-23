// src/proveedores/SeguimientoEntregas.jsx
import React, { useEffect, useState } from 'react';

const SeguimientoEntregas = () => {
    const [entregas, setEntregas] = useState([]);

    useEffect(() => {
        // Aquí iría la lógica para obtener las entregas del backend
        // Ejemplo de datos simulados:
        setEntregas([
            { id: 1, fecha: '2024-11-03', proveedor: 'Proveedor A', status: 'En camino' },
            { id: 2, fecha: '2024-11-04', proveedor: 'Proveedor B', status: 'Entregado' },
        ]);
    }, []);

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Seguimiento de Entregas</h2>
            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Fecha</th>
                        <th className="p-2 border">Proveedor</th>
                        <th className="p-2 border">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {entregas.map((entrega) => (
                        <tr key={entrega.id}>
                            <td className="p-2 border">{entrega.id}</td>
                            <td className="p-2 border">{entrega.fecha}</td>
                            <td className="p-2 border">{entrega.proveedor}</td>
                            <td className="p-2 border">{entrega.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SeguimientoEntregas;
