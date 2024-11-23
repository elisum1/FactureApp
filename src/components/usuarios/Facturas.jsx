import React, { useState, useEffect } from 'react';

const Fact = () => {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [empresaInfo, setEmpresaInfo] = useState(null); // Información de la empresa
    const [currentPage, setCurrentPage] = useState(1);
    const [facturasPorPagina] = useState(7);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmacionVisible, setConfirmacionVisible] = useState(false);

    useEffect(() => {
        fetchFacturas();
        fetchEmpresaInfo(); // Cargar la información de la empresa
    }, [fechaSeleccionada]);

    // Obtener la información de la empresa
    const fetchEmpresaInfo = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/infoFactura/informacion-factura');
            if (!response.ok) throw new Error('Error al obtener la información de la empresa');
            const data = await response.json();
            setEmpresaInfo(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchFacturas = async () => {
        try {
            setLoading(true);
            setError(null);
            const url = `http://localhost:5000/api/facturas/fecha?fecha=${fechaSeleccionada}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al obtener las facturas');
            const data = await response.json();
            if (data.facturas.length === 0) {
                setError('No hay facturas disponibles para la fecha seleccionada');
            } else {
                setFacturas(data.facturas);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleVerFactura = (factura) => {
        setFacturaSeleccionada(factura);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setFacturaSeleccionada(null);
    };

    // Función para eliminar una factura
    const handleEliminarFactura = async () => {
        if (!facturaSeleccionada) return; // Verificar que haya una factura seleccionada
        try {
            const response = await fetch(`http://localhost:5000/api/facturas/${facturaSeleccionada.id}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Error al eliminar la factura');
            }
    
            // Actualizar el estado de las facturas después de eliminar
            setFacturas(facturas.filter(factura => factura.id !== facturaSeleccionada.id));
    
            // Cerrar el modal después de eliminar
            cerrarConfirmacionEliminar();
        } catch (err) {
            setError(err.message);
        }
    };

// Función para mostrar el modal de confirmación
const mostrarConfirmacionEliminar = (factura) => {
    setFacturaSeleccionada(factura);
    setConfirmacionVisible(true);
};


    // Función para cerrar el modal de confirmación
    const cerrarConfirmacionEliminar = () => {
        setConfirmacionVisible(false);
        setFacturaSeleccionada(null);
    };

    const handlePrint = () => {
        if (!facturaSeleccionada) return; // Prevenir errores si no hay factura seleccionada

        const fechaActual = new Date(facturaSeleccionada.fecha).toLocaleString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        const descuentoTotalFinal = facturaSeleccionada.descuentoTotal || 0;
        const productos = JSON.parse(facturaSeleccionada.nombre); // Parseamos la propiedad nombre

        // Si la información de la empresa está cargada
        if (!empresaInfo) return;

        const facturaHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Factura Generada</title>
                <style>
                    body {
                        font-family: 'Courier New', Courier, monospace;
                        width: 58mm;
                        padding: 0;
                        color: #000;
                        font-weight: bold;
                    }
                    h1, h2 {
                        text-align: center;
                        margin: 0;
                        font-size: 1.4em;
                        margin-bottom: 8px;
                    }
                    h2 {
                        margin-top: 10px;
                        font-weight: bold;
                    }
                    .info {
                        text-align: center;
                        margin-top: 10px;
                        font-size: 1.2em;
                    }
                    .info p {
                        margin: 3px 0;
                    }
                    table {
                        width: 100%;
                        font-size: 0.9em;
                        margin-top: 15px;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 6px 0;
                        text-align: left;
                    }
                    th {
                        border-top: 1px solid #000;
                        border-bottom: 1px solid #000;
                    }
                    tr {
                        border-bottom: 1px solid #ddd;
                    }
                    .total-section {
                        text-align: right;
                        font-weight: bold;
                        font-size: 1.3em;
                        margin-top: 20px;
                        padding-top: 10px;
                        border-top: 1px solid #000;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 15px;
                        font-size: 1em;
                        padding-top: 10px;
                        border-top: 1px dashed #000;
                    }
                    .footer p {
                        margin: 4px 0;
                    }
                </style>
            </head>
            <body>
                <h1>${empresaInfo.empresa}</h1>
                <div class="info">
                    <p>Dirección: ${empresaInfo.direccion}</p>
                    <p>Tel: ${empresaInfo.telefono}</p>
                    <p>Fecha: ${fechaActual}</p>
                </div>
                <h2>Factura</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Prod.</th>
                            <th>Cant</th>
                            <th>Desc (%)</th>
                            <th>Desc ($)</th>
                            <th>Precio Desc</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productos.map(producto => {
                            const descuentoValido = producto.descuento || 0; // Default to 0 if no discount
                            const descuentoDinero = (producto.costo * (descuentoValido / 100)) * producto.cantidad;
                            const precioConDescuento = (producto.costo - (producto.costo * (descuentoValido / 100))) * producto.cantidad;
                            const totalProducto = (producto.costo * producto.cantidad) - descuentoDinero;

                            return `
                                <tr>
                                    <td>${producto.nombre}</td>
                                    <td>${producto.cantidad}</td>
                                    <td>${descuentoValido}%</td>
                                    <td>${descuentoDinero}</td>
                                    <td>${precioConDescuento}</td>                       
                                    <td>${totalProducto}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                <div class="total-section">
                    <p>Subtotal: $${facturaSeleccionada.total}</p>
                    <p>Descuento Total: $${descuentoTotalFinal}</p>
                    <p>Total: $${(facturaSeleccionada.total - descuentoTotalFinal)}</p>
                </div>
                <div class="footer">
                    <p>Terminal: Usuario-PC</p>
                    <p>Gracias por su compra!</p>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '', 'height=800,width=600');
        printWindow.document.write(facturaHTML);
        printWindow.document.close();
        printWindow.print();
    };

    if (loading) return <p className="text-center text-gray-500">Cargando facturas...</p>;

    const indexOfLastFactura = currentPage * facturasPorPagina;
    const indexOfFirstFactura = indexOfLastFactura - facturasPorPagina;
    const currentFacturas = facturas.slice(indexOfFirstFactura, indexOfLastFactura);
    const totalPages = Math.ceil(facturas.length / facturasPorPagina);

    return (
        <div className="max-w-8xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg h-[90%]">
            <div className='flex justify-between mb-4'>
                <div className="flex justify-center gap-4">
                    {/* Paginación */}
                    <div className="pagination flex justify-center space-x-2">
                        {currentPage > 1 && (
                            <button onClick={() => handlePageChange(1)} className="bg-gray-400 p-2 rounded-md text-white hover:bg-gray-500 transition duration-200">
                                Primero
                            </button>
                        )}
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`p-2 rounded-md text-white ${currentPage === index + 1 ? 'bg-blue-500' : 'bg-gray-400 hover:bg-gray-500'} transition duration-200`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        {currentPage < totalPages && (
                            <button onClick={() => handlePageChange(totalPages)} className="bg-gray-400 p-2 rounded-md text-white hover:bg-gray-500 transition duration-200">
                                Último
                            </button>
                        )}
                    </div>
                </div>
                <div>
                    <input
                        type="date"
                        value={fechaSeleccionada}
                        onChange={(e) => setFechaSeleccionada(e.target.value)}
                        className="p-2 bg-gray-200 border rounded-md"
                    />
                </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <table className="min-w-full table-auto text-sm bg-slate-600">
                <thead>
                    <tr className="text-white ">
                        <th className="border px-4 py-2">Factura</th>
                        <th className="border px-4 py-2">Total</th>
                        <th className="border px-4 py-2">Método</th>
                        <th className="border px-2 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentFacturas.map(factura => (
                        <tr key={factura.id} onClick={()=> handleVerFactura(factura)} className=" text-white  bg-slate-800 ">
                            <td className="border px-7 py-2">{factura.id}</td>
                            <td className="border px-7 py-2">{factura.total}</td>
                            <td className="border px-7 py-2">{factura.metodo}</td>
                            <td className="border py-2">
                                <button
                                    className="bg-red-500 text-white p-2 rounded-md ml-2"
                                    onClick={() => mostrarConfirmacionEliminar()}
                                >
                                        Eliminar Factura
                                </button>

                                <button
                                    className="bg-blue-500 text-white p-2 rounded-md ml-2"
                                    onClick={()=> handleVerFactura(factura)}
                                >
                                        imprimir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de confirmación para eliminar */}
            {confirmacionVisible && facturaSeleccionada && (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="modal-content bg-white rounded-lg p-6 w-80">
            <h2 className="text-xl font-semibold mb-4">¿Estás seguro?</h2>
            <p className="mb-4">¿Deseas eliminar esta factura?</p>
            <div className="flex justify-around">
                <button
                    onClick={handleEliminarFactura} // Llamar a la función de eliminar
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                    Eliminar
                </button>
                <button
                    onClick={cerrarConfirmacionEliminar}
                    className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
                >
                    Cancelar
                </button>
            </div>
        </div>
    </div>
)}

            {/* Modal */}
            {modalVisible && facturaSeleccionada && (
                <div className="modal fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-14 rounded-md flex items-center gap-7">
                        <button onClick={closeModal} className="text-white bg-red-500 p-2 rounded-md ">Cerrar</button>
                        <h2>Factura {facturaSeleccionada.id}</h2>
                        <p>Total: ${facturaSeleccionada.total}</p>
                        <button
                            onClick={handlePrint}
                            className="bg-blue-500 text-white p-2 rounded-md "
                        >
                            Imprimir
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fact;
