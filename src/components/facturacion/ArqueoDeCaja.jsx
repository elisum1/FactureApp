import React, { useState, useEffect } from "react";

const FacturasPorMetodo = () => {
    const [facturas, setFacturas] = useState({
        Efectivo: [],
        Datafono: [],
        Transferencia: [],
    });
    const [totales, setTotales] = useState({
        Efectivo: 0,
        Datafono: 0,
        Transferencia: 0,
        TotalVentas: 0,
    });

    useEffect(() => {
        fetchFacturasPorMetodo();
    }, []);

    const fetchFacturasPorMetodo = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/facturas/dia");
            const datos = await response.json();
            console.log("Facturas obtenidas:", datos);

            // Clasificar facturas por método de pago y calcular totales
            const facturasPorMetodo = {
                Efectivo: [],
                Datafono: [],
                Transferencia: [],
            };
            const totalesPorMetodo = {
                Efectivo: 0,
                Datafono: 0,
                Transferencia: 0,
                TotalVentas: 0,
            };

            datos.forEach((factura) => {
                const metodoPago = factura.metodo || "Sin método";
                if (metodoPago === "Efectivo") {
                    facturasPorMetodo.Efectivo.push(factura);
                    totalesPorMetodo.Efectivo += factura.total;
                } else if (metodoPago === "Datafono") {
                    facturasPorMetodo.Datafono.push(factura);
                    totalesPorMetodo.Datafono += factura.total;
                } else if (metodoPago === "Transferencia") {
                    facturasPorMetodo.Transferencia.push(factura);
                    totalesPorMetodo.Transferencia += factura.total;
                }
            });

            // Calcular el total de ventas
            totalesPorMetodo.TotalVentas =
                totalesPorMetodo.Efectivo +
                totalesPorMetodo.Datafono +
                totalesPorMetodo.Transferencia;

            setFacturas(facturasPorMetodo);
            setTotales(totalesPorMetodo);
        } catch (error) {
            console.error("Error al obtener las facturas:", error);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-green-700 mb-4">
                Facturas por Método de Pago
            </h1>
            {Object.entries(facturas).map(([metodo, listaFacturas]) => (
                <div key={metodo} className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">
                        {metodo} ({listaFacturas.length}) - Total: ${totales[metodo].toFixed(2)}
                    </h2>
                    <ul className="mt-2 bg-white p-4 border rounded-lg shadow">
                        {listaFacturas.length === 0 ? (
                            <li className="text-gray-500">Sin facturas</li>
                        ) : (
                            listaFacturas.map((factura) => (
                                <li
                                    key={factura.id}
                                    className="py-2 border-b last:border-none flex justify-between"
                                >
                                    <span>ID: {factura.id}</span>
                                    <span>${factura.total.toFixed(2)}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            ))}
            <div className="mt-6 p-4 bg-green-200 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-green-900">
                    Total de Ventas: ${totales.TotalVentas.toFixed(2)}
                </h2>
            </div>
        </div>
    );
};

export default FacturasPorMetodo;
