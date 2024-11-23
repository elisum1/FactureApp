import React, { useState, useEffect } from 'react';

const GestionarFactura = () => {
    const [factura, setFactura] = useState(null);
    const [empresa, setEmpresa] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [nit, setNit] = useState('');
    const [saludo, setSaludo] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [facturaId, setFacturaId] = useState(null);

    // Fetch existing factura when the component loads
    useEffect(() => {
        const fetchFactura = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/infoFactura/informacion-factura');
                if (response.ok) {
                    const data = await response.json();
                    if (data[0]) {
                        const { id, empresa, direccion, telefono, nit, saludo } = data[0];
                        setFacturaId(id);
                        setEmpresa(empresa);
                        setDireccion(direccion);
                        setTelefono(telefono);
                        setNit(nit);
                        setSaludo(saludo);
                        setFactura(data[0]); // Save the full factura data
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                setMensaje('Error al cargar información de la factura');
            }
        };
        fetchFactura();
    }, []);

    // Handle saving/updating factura
    const handleSubmit = async (e) => {
        e.preventDefault();
        const facturaData = { empresa, direccion, telefono, nit, saludo };
        const url = facturaId
            ? `http://localhost:5000/api/infoFactura/informacion-factura/${facturaId}`
            : 'http://localhost:5000/api/infoFactura/informacion-factura';
        const method = facturaId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(facturaData)
            });

            if (response.ok) {
                setMensaje('Información de la factura guardada/actualizada con éxito');
            } else {
                setMensaje('Error al guardar/actualizar la información de la factura');
            }
        } catch (error) {
            console.error('Error:', error);
            setMensaje('Error de conexión al servidor');
        }
    };

    // Handle deleting factura
    const handleEliminar = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/infoFactura/informacion-factura/${facturaId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setMensaje('Información de la factura eliminada con éxito');
                setFactura(null);
                setFacturaId(null);
                setEmpresa('');
                setDireccion('');
                setTelefono('');
                setNit('');
                setSaludo('');
            } else {
                setMensaje('Error al eliminar la información de la factura');
            }
        } catch (error) {
            console.error('Error:', error);
            setMensaje('Error de conexión al servidor');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
            <h2 className="text-2xl font-semibold mb-4">
                {facturaId ? 'Actualizar Información de Factura' : 'Guardar Información de Factura'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold">Empresa:</label>
                    <input
                        type="text"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold">Dirección:</label>
                    <input
                        type="text"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold">Teléfono:</label>
                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold">NIT:</label>
                    <input
                        type="text"
                        value={nit}
                        onChange={(e) => setNit(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold">Saludo:</label>
                    <input
                        type="text"
                        value={saludo}
                        onChange={(e) => setSaludo(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {facturaId ? 'Actualizar' : 'Guardar'}
                </button>
            </form>

            {facturaId && (
                <button
                    onClick={handleEliminar}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Eliminar
                </button>
            )}

            {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}

            {factura && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Información de la Factura</h3>
                    <p><strong>Empresa:</strong> {factura.empresa}</p>
                    <p><strong>Dirección:</strong> {factura.direccion}</p>
                    <p><strong>Teléfono:</strong> {factura.telefono}</p>
                    <p><strong>NIT:</strong> {factura.nit}</p>
                    <p><strong>Saludo:</strong> {factura.saludo}</p>
                </div>
            )}
        </div>
    );
};

export default GestionarFactura;
