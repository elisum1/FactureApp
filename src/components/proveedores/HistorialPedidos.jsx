// src/proveedores/HistorialPedidos.jsx
import React, { useEffect, useState } from 'react';

const HistorialPedidos = () => {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        // Aquí iría la lógica para obtener los pedidos del backend
        // Ejemplo de datos simulados:
        setPedidos([
            { id: 1, fecha: '2024-11-01', total: 500, estado: 'Entregado' },
            { id: 2, fecha: '2024-11-02', total: 300, estado: 'Pendiente' },
        ]);
    }, []);

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Historial de Pedidos</h2>
            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Fecha</th>
                        <th className="p-2 border">Total</th>
                        <th className="p-2 border">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido) => (
                        <tr key={pedido.id}>
                            <td className="p-2 border">{pedido.id}</td>
                            <td className="p-2 border">{pedido.fecha}</td>
                            <td className="p-2 border">${pedido.total}</td>
                            <td className="p-2 border">{pedido.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistorialPedidos;
