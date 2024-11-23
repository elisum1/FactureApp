import { useState, useEffect, useRef } from 'react';

const CierreDefinitivo = () => {
    const printRef = useRef();

    // Estados
    const [pagos, setPagos] = useState({
        Efectivo: [],
        Datafono: [],
        Transferencia: []
    });
    const [facturas, setFacturas] = useState([]);
    const [ultimoCierreId, setUltimoCierreId] = useState(null);
    const [mensajeError, setMensajeError] = useState("");

    // Efectos secundarios
    useEffect(() => {
        obtenerFacturasDelDia();
        verificarCierreDelDia();
    }, [ultimoCierreId]);

    // Funciones de API
    const obtenerFacturasDelDia = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/facturas/dia');
            const facturas = await response.json();

            // Filtrar facturas que no tienen cierre asociado
            const facturasNoCerradas = facturas.filter(factura => !factura.cierre_id);
            setFacturas(facturasNoCerradas);
        } catch (error) {
            console.error('Error al obtener facturas del día:', error);
        }
    };

    const verificarCierreDelDia = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch(`http://localhost:5000/api/cierreDefinitivo/cierreDefinitivo?fecha=${today}`);
            const cierreExistente = await response.json();

            // Validar si ya existe un cierre para hoy
            if (Array.isArray(cierreExistente.cierres) && cierreExistente.cierres.length > 0) {
                const fechaUltimoCierre = cierreExistente.cierres[0].fecha_hora.split('T')[0];

                if (fechaUltimoCierre === today) {
                    setMensajeError("Cierre ya realizado para hoy, no se puede volver a realizar.");
                } else {
                    setMensajeError("");
                }
            } else {
                setMensajeError("");
            }
        } catch (error) {
            console.error('Error al verificar el cierre del día:', error);
        }
    };

    // Cálculos
    const calcularTotalFacturas = (metodo) => {
        const facturasFiltradas = facturas.filter(factura => factura.metodo === metodo);
        return facturasFiltradas.reduce((acc, factura) => acc + parseFloat(factura.total), 0);
    };

    const totalEfectivo = calcularTotalFacturas('Efectivo');
    const totalDatafono = calcularTotalFacturas('Datafono');
    const totalTransferencia = calcularTotalFacturas('Transferencia');
    const totalGeneral = totalEfectivo + totalDatafono + totalTransferencia;

    // Manejadores de eventos
    const handleCierreDefinitivo = async () => {
        if (mensajeError) {
            alert(mensajeError);
            return;
        }

        const cierreData = {
            total_efectivo: totalEfectivo,
            total_datafono: totalDatafono,
            total_transferencia: totalTransferencia,
            total_general: totalGeneral,
            pagos_efectivo: pagos.Efectivo.map(pago => pago.total).join(', '),
            pagos_datafono: pagos.Datafono.map(pago => pago.total).join(', '),
            pagos_transferencia: pagos.Transferencia.map(pago => pago.total).join(', '),
            fecha_hora: new Date().toISOString(),
            facturas: facturas
        };

        try {
            const response = await fetch('http://localhost:5000/api/cierreDefinitivo/cierreDefinitivo/crear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cierreData),
            });

            if (response.ok) {
                const newCierre = await response.json();
                setUltimoCierreId(newCierre.id);
                alert("Cierre definitivo realizado y guardado con éxito.");
                resetState();
            } else {
                alert("Hubo un error al guardar el cierre definitivo.");
            }
        } catch (error) {
            console.error('Error en la solicitud de cierre definitivo:', error);
            alert("Error al realizar el cierre definitivo.");
        }
    };

    const handlePrint = () => {
        const printContent = printRef.current;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <style>
                        @media print {
                            body { margin: 0; font-family: monospace; width: 100px; font-size: 1rem; }
                            .tirilla { width: 100%; text-align: center; padding: 1px; }
                            h2 { text-align: center; font-size: 25px; }
                            .section { border-top: 1px dashed #000; padding-top: 10px; margin-top: 10px; }
                            .totals { font-weight: bold; }
                            .facturas-column { display: flex; gap: 19px; align-items: center; }
                            .factura-column { flex: 1; }
                        }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    ${printContent.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const resetState = () => {
        setPagos({ Efectivo: [], Datafono: [], Transferencia: [] });
        setFacturas([]);
        setMensajeError("");
    };

    // Renderizado
    return (
        <div className="w-full flex flex-col items-center mt-20">
            {mensajeError && <div className="text-red-500">{mensajeError}</div>}

            <div ref={printRef} className="tirilla border border-gray-400 p-4 bg-white text-sm w-80 max-h-[90vh] overflow-y-auto">
                <h2 className="text-center font-bold">Cierre Definitivo de Caja</h2>

                <div className="section">
                    <p>Total en Efectivo: C${totalEfectivo}</p>
                    <p>Total en Datáfono: C${totalDatafono}</p>
                    <p>Total en Transferencia: C${totalTransferencia}</p>
                    <p className="totals">Total General: C${totalGeneral}</p>
                </div>

                <h3 className="font-semibold">Pagos Discriminados</h3>
                <div className="section flex gap-5">
                    {['Efectivo', 'Datafono', 'Transferencia'].map(metodo => (
                        <div key={metodo}>
                            <h4>{metodo}</h4>
                            {pagos[metodo].map((pago, index) => (
                                <p key={index}>{`C$${pago.total}`}</p>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="section facturas-column flex gap-4">
                    {['Efectivo', 'Datafono', 'Transferencia'].map(metodo => (
                        <div key={metodo} className="factura-column flex-1">
                            <h4>{metodo}</h4>
                            {facturas.filter(factura => factura.metodo === metodo).map((factura, index) => (
                                <div key={index} className="factura mb-2">
                                    <p><strong>Factura #{factura.id}</strong> - {factura.nombre}</p>
                                    <p>Metodo de pago: {factura.metodo}</p>
                                    <p>Total: C${factura.total}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="mt-4 text-center flex gap-9 justify-center font-semibold text-white">
                    <button onClick={handleCierreDefinitivo} className="btn btn-primary bg-green-400 p-1.5 rounded-md">Realizar Cierre</button>
                    <button onClick={handlePrint} className="btn btn-secondary bg-blue-500 p-1.5 rounded-md">Imprimir</button>
                </div>
            </div>
        </div>
    );
};

export default CierreDefinitivo;
