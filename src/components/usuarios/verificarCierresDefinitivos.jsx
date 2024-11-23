import React, { useState, useEffect } from 'react';

const CierresGenerados = () => {
    const [cierres, setCierres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Función para cargar los cierres desde la API
        const fetchCierres = async () => {
            try {
                console.log('Cargando los cierres...');
                const response = await fetch('http://localhost:5000/api/cierreDefinitivo/cierreDefinitivo'); // Cambia esta URL según tu backend
                console.log('Respuesta de la API:', response);

                // Verifica si la respuesta es JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('La respuesta no es JSON');
                }

                const data = await response.json();
                console.log('Datos obtenidos:', data);
                setCierres(data.cierres);
            } catch (err) {
                console.error('Error al obtener los cierres:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCierres();
    }, []);

    const eliminarCierre = async (id) => {
        console.log(`Intentando eliminar cierre con ID: ${id}`);
        if (window.confirm('¿Estás seguro de que deseas eliminar este cierre?')) {
            try {
                console.log('Realizando solicitud DELETE...');
                const response = await fetch(`http://localhost:5000/api/cierreDefinitivo/cierreDefinitivo/${id}`, {
                    method: 'DELETE',
                });
                console.log('Respuesta de la API al eliminar:', response);

                // Verifica si la respuesta es JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('La respuesta no es JSON');
                }

                const data = await response.json();
                console.log('Respuesta de la eliminación:', data);
                alert(data.message);
                setCierres(cierres.filter(cierre => cierre.id !== id)); // Eliminar el cierre de la lista
            } catch (err) {
                console.error('Error al eliminar el cierre:', err);
                alert('Error al eliminar el cierre: ' + err.message);
            }
        }
    };

    if (loading) {
        console.log('Cargando cierres...');
        return <div>Cargando cierres...</div>;
    }

    if (error) {
        console.error('Error en la carga de cierres:', error);
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Cierres Generados</h3>
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">ID</th>
                        <th className="px-4 py-2 border">Fecha y Hora</th>
                        <th className="px-4 py-2 border">Total Efectivo</th>
                        <th className="px-4 py-2 border">Total Datafono</th>
                        <th className="px-4 py-2 border">Total Transferencia</th>
                        <th className="px-4 py-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cierres.map((cierre) => (
                        <tr key={cierre.id}>
                            <td className="px-4 py-2 border">{cierre.id}</td>
                            <td className="px-4 py-2 border">{new Date(cierre.fecha_hora).toLocaleString()}</td>
                            <td className="px-4 py-2 border">${cierre.total_efectivo.toFixed(2)}</td>
                            <td className="px-4 py-2 border">${cierre.total_datafono.toFixed(2)}</td>
                            <td className="px-4 py-2 border">${cierre.total_transferencia.toFixed(2)}</td>
                            <td className="px-4 py-2 border">
                                <button
                                    onClick={() => eliminarCierre(cierre.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CierresGenerados;