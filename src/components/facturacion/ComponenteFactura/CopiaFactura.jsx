import React from "react";

const CopiaFactura = ({ factura, onClose }) => {
    const handlePrint = () => {
        const fechaActual = new Date(factura.fecha).toLocaleString("es-ES", {
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
                        body { font-family: 'Courier New', Courier, monospace; width: 58mm; margin: 0; padding: 10px; color: #000; }
                        h1, h2 { text-align: center; font-size: 1.2em; }
                        .info { text-align: center; margin-top: 10px; }
                        .info p { font-size: 0.9em; }
                        table { width: 100%; font-size: 0.9em; margin-top: 10px; border-collapse: collapse; }
                        th, td { padding: 5px 0; text-align: left; }
                        th { border-top: 1px solid #000; border-bottom: 1px solid #000; }
                        .total-section { text-align: right; font-weight: bold; }
                        .footer { text-align: center; font-size: 0.8em; }
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
                        <tr><th>Producto</th><th>Cant</th><th>Total</th></tr>
                        <tr><td>${factura.nombre}</td><td>1</td><td>${factura.total.toFixed(2)}</td></tr>
                    </table>
                    <div class="total-section">
                        <p>Subtotal: $${factura.total.toFixed(2)}</p>
                        <p>Impuestos: $0.00</p>
                        <p>Total: $${factura.total.toFixed(2)}</p>
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
            };
        };
    };

    return (
        <div>
            <h3>Detalles de la factura</h3>
            <p>Nombre: {factura.nombre}</p>
            <p>Empresa: {factura.empresa || 'No especificada'}</p>
            <p>Total: ${factura.total.toFixed(2)}</p>
            <p>Método de pago: {factura.metodo}</p>
            <button onClick={handlePrint}>Imprimir Factura</button>
            <button onClick={onClose}>Cerrar</button>
        </div>
    );
};

export default CopiaFactura;
