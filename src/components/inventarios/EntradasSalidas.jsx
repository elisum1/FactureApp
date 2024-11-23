import React, { useState, useEffect } from 'react';

const EntradasSalidas = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]); // Nuevo estado para las categorías
    const [historial, setHistorial] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [tipoMovimiento, setTipoMovimiento] = useState('entrada');
    const [cantidad, setCantidad] = useState('');
    const [unidad, setUnidad] = useState('unidad');
    const [mostrarModal, setMostrarModal] = useState(false); // Estado para manejar el modal
    const [busqueda, setBusqueda] = useState(''); // Estado para el buscador
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(''); // Estado para la categoría seleccionada

    useEffect(() => {
        // Obtener los productos
        fetch('http://localhost:5000/api/productos')
            .then(response => response.json())
            .then(data => setProductos(data.productos))
            .catch(error => console.error('Error al cargar productos:', error));

        // Obtener las categorías
        fetch('http://localhost:5000/api/getCategorias')
            .then(response => response.json())
            .then(data => setCategorias(data))  // Guardar las categorías obtenidas
            .catch(error => console.error('Error al cargar categorías:', error));
    }, []);

    const registrarMovimiento = (e) => {
        e.preventDefault();

        if (!productoSeleccionado || !cantidad || isNaN(cantidad) || cantidad <= 0) {
            console.error('Por favor, selecciona un producto y proporciona una cantidad válida.');
            return;
        }

        fetch(`http://localhost:5000/api/productos/${productoSeleccionado}/unidad`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ unidad })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            // Luego registra el movimiento de entrada o salida
            return fetch(`http://localhost:5000/api/productos/${productoSeleccionado}/stock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cantidad: parseFloat(cantidad), tipo: tipoMovimiento })
            });
        })
        .then(response => response.json())
        .then(data => {
            const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
            setHistorial([...historial, { ...producto, tipo: tipoMovimiento, cantidad, unidad }]);
            setProductoSeleccionado('');
            setCantidad('');
            setUnidad('unidad');
        })
        .catch(error => console.error('Error al registrar el movimiento:', error));
    };

    const handleSeleccionarProducto = (productoId) => {
        setProductoSeleccionado(productoId);
        setMostrarModal(false); // Cerrar el modal después de seleccionar un producto
    };

    // Filtrar productos según búsqueda y categoría
    const productosFiltrados = productos.filter(producto => {
        const filtroPorNombre = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const filtroPorCategoria = categoriaSeleccionada
            ? producto.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase()
            : true;
        return filtroPorNombre && filtroPorCategoria;
    });

    // Función para imprimir
    const imprimirHistorial = () => {
        const printContent = document.getElementById('historial-to-print');
        const printWindow = window.open('', '', 'height=500, width=800');
        
        // Estilos mejorados y fecha y hora
        const currentDate = new Date().toLocaleString(); // Obtener la fecha y hora actual
    
        printWindow.document.write(`
            <html>
            <head>
                <title>Historial de Movimientos</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        font-size: 16px;
                        line-height: 1.5;
                        margin: 0;
                        padding: 0;
                    }
                    .header {
                        text-align: center;
                        font-size: 24px;
                        font-weight: bold;
                        margin-top: 20px;
                    }
                    .date {
                        text-align: center;
                        font-size: 18px;
                        margin-top: 10px;
                        color: gray;
                    }
                    .content {
                        margin: 30px;
                        font-size: 14px;
                    }
                    .content ul {
                        list-style-type: none;
                        padding: 0;
                    }
                    .content li {
                        padding: 8px;
                        border-bottom: 1px solid #ccc;
                    }
                    .content .entrada {
                        color: green;
                    }
                    .content .salida {
                        color: red;
                    }
                </style>
            </head>
            <body>
                <div class="header">Historial de Movimientos</div>
                <div class="date">Fecha y Hora: ${currentDate}</div>
                <div class="content">
                    ${printContent.innerHTML}
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    };
    
    return (
        <div>
            <header className="bg-blue-600 p-4 text-white text-center w-full">
                <h1 className="text-2xl font-semibold">Gestión de Inventarios</h1>
                <p className="text-sm">Administra tus productos y controla tu inventario</p>
            </header>

            <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-xl">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Gestión de Entradas y Salidas de Productos</h2>

                <form onSubmit={registrarMovimiento} className="space-y-6">
                    {/* Selección del tipo de movimiento */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Tipo de Movimiento</label>
                        <select 
                            value={tipoMovimiento} 
                            onChange={(e) => setTipoMovimiento(e.target.value)} 
                            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="entrada">Entrada</option>
                            <option value="salida">Salida</option>
                        </select>
                    </div>

                    {/* Botón para seleccionar producto */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Seleccionar Producto</label>
                        <button
                            type="button"
                            onClick={() => setMostrarModal(true)}
                            className="mt-2 block w-full p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                        >
                            {productoSeleccionado ? `Producto: ${productos.find(p => p.id === parseInt(productoSeleccionado))?.nombre}` : "Seleccionar Producto"}
                        </button>
                    </div>

                    {/* Selección de unidad */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Unidad de Medida</label>
                        <select 
                            value={unidad} 
                            onChange={(e) => setUnidad(e.target.value)} 
                            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="unidad">Unidad</option>
                            <option value="litros">Litros</option>
                            <option value="libras">Libras</option>
                            <option value="kilos">Kilos</option>
                            <option value="gramos">Gramos</option>
                        </select>
                    </div>

                    {/* Campo de cantidad */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Cantidad</label>
                        <input
                            type="number"
                            placeholder="Cantidad"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Botón para registrar */}
                    <div>
                        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
                            Registrar Movimiento
                        </button>
                    </div>
                </form>

                {/* Botón para imprimir */}
                <div className="mt-6">
                    <button
                        onClick={imprimirHistorial}
                        className="w-full bg-green-600 text-white p-3 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                    >
                        Imprimir Historial
                    </button>
                </div>

                {/* Historial de movimientos */}
                <h3 className="text-xl font-semibold text-gray-800 mt-12">Historial de Movimientos</h3>
                <ul className="mt-4" id="historial-to-print">
                    {historial.length > 0 ? (
                        historial.map((mov, index) => (
                            <li key={index} className="border-b py-3">
                                <div>

                              
                                </div>
                                <span className={`font-semibold ${mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                                    {mov.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                                </span> - {mov.nombre}: {mov.cantidad} {mov.unidad}
                                
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay movimientos registrados.</p>
                    )}
                </ul>

                {/* Modal para seleccionar producto */}
                   {/* Modal para seleccionar producto */}
                   {mostrarModal && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Seleccionar Producto</h3>
                            <input
                                type="text"
                                placeholder="Buscar producto..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm"
                            />
                            
                            {/* Filtro de categoría */}
                            <select
                                value={categoriaSeleccionada}
                                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                                className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm"
                            >
                                <option value="">Seleccionar Categoría</option>
                                {categorias.map((categoria, index) => (
                                    <option key={index} value={categoria.id}> 
                                        {categoria.categoria} 
                                    </option>
                                ))}
                            </select>

                            <ul className="space-y-2 max-h-64 overflow-y-auto">
                                {productosFiltrados.map((producto) => (
                                    <li key={producto.id} className="border p-3 flex justify-between items-center hover:bg-gray-200">
                                        <span>{producto.nombre} - {producto.categoria}</span>
                                        <button
                                            onClick={() => handleSeleccionarProducto(producto.id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                        >
                                            Seleccionar
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => setMostrarModal(false)}
                                className="mt-4 w-full bg-red-600 text-white p-3 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EntradasSalidas;
