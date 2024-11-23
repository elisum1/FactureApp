import React, { forwardRef, useState } from "react";

const FacturaGenerada = forwardRef(({ productosEnFactura, limpiarFactura }, ref) => {
    const [mostrarBoton, setMostrarBoton] = useState(true); // Estado para controlar la visibilidad del botón

    const calcularTotales = () => {
        const descuentoTotal = productosEnFactura.reduce((acc, producto) => {
            const descuentoValido = producto.descuento || 0;
            return acc + (producto.costo * (descuentoValido / 100)) * producto.cantidad;
        }, 0);

        const subtotal = productosEnFactura.reduce((acc, producto) => {
            return acc + producto.costo * producto.cantidad;
        }, 0);

        return {
            subtotal,
            descuentoTotal,
            total: subtotal - descuentoTotal,
        };
    };

    const { subtotal, descuentoTotal, total } = calcularTotales();

    const imprimirFactura = () => {
        const fechaActual = new Date().toLocaleString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    
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
                            margin: 0;
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
                        .info, .footer {
                            text-align: center;
                            margin-top: 10px;
                            font-size: 1.2em;
                        }
                        .info p, .footer p {
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
                    </style>
                </head>
                <body>
                    <h1>Mauro Services</h1>
                    <div class="info">
                        <p>Dirección: Gaira-El Socorro</p>
                        <p>Tel: +123 456 7890</p>
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
                            ${productosEnFactura.map(producto => {
                                const descuentoValido = producto.descuento || 0;
                                const descuentoDinero = (producto.costo * (descuentoValido / 100)) * producto.cantidad;
                                const precioConDescuento = producto.costo - producto.costo * (descuentoValido / 100);
                                const totalProducto = precioConDescuento * producto.cantidad;
    
                                return `
                                    <tr>
                                        <td>${producto.nombre}</td>
                                        <td>${producto.cantidad}</td>
                                        <td>${descuentoValido}%</td>
                                        <td>${descuentoDinero.toFixed(2)}</td>
                                        <td>${precioConDescuento.toFixed(2)}</td>
                                        <td>${totalProducto.toFixed(2)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    <div class="total-section">
                        <p>Subtotal: $${subtotal.toFixed(2)}</p>
                        <p>Descuento Total: $${descuentoTotal.toFixed(2)}</p>
                        <p>Total: $${total.toFixed(2)}</p>
                    </div>
                    <div class="footer">
                        <p>Terminal: Usuario-PC</p>
                        <p>Gracias por su compra!</p>
                    </div>
                </body>
            </html>
        `;
    
        const ventanaImpresion = window.open("", "_blank", "width=300,height=600");
        ventanaImpresion.document.open();
        ventanaImpresion.document.write(facturaHTML);
        ventanaImpresion.document.close();
    
        ventanaImpresion.onload = () => {
            ventanaImpresion.print();
            ventanaImpresion.onafterprint = () => {
                ventanaImpresion.close();
                limpiarFactura();
                setMostrarBoton(false); // Ocultar botón después de limpiar la factura
            };
        };
    };
    

    return (
        <div ref={ref}>
            {mostrarBoton && (
                <button
                    onClick={imprimirFactura}
                    style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
                >
                    Imprimir Factura
                </button>
            )}
        </div>
    );
});

export default FacturaGenerada;
