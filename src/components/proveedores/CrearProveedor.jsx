// src/proveedores/CrearProveedor.jsx
import React, { useState } from 'react';

const CrearProveedor = () => {
    const [nombre, setNombre] = useState('');
    const [contacto, setContacto] = useState('');
    const [direccion, setDireccion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar los datos al backend
        console.log("Proveedor creado:", { nombre, contacto, direccion });
        // Limpiar el formulario
        setNombre('');
        setContacto('');
        setDireccion('');
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Crear Proveedor</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Contacto</label>
                    <input
                        type="text"
                        value={contacto}
                        onChange={(e) => setContacto(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Dirección</label>
                    <input
                        type="text"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Crear Proveedor</button>
            </form>
        </div>
    );
};

export default CrearProveedor;
