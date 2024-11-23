import React, { useState, useEffect, useRef } from 'react';

const DiferenciasStock = () => {
    const [productos, setProductos] = useState([]);
    const [stockFisico, setStockFisico] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [stockInput, setStockInput] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [nombreFiltro, setNombreFiltro] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/productos')
            .then(response => response.json())
            .then(data => setProductos(data.productos))
            .catch(error => console.error('Error al cargar productos:', error));

        const storedStock = JSON.parse(localStorage.getItem('stockFisico'));
        if (storedStock) {
            setStockFisico(storedStock);
        }
    }, []);

    const handleStockFisicoChange = (value) => {
        if (value >= 0) {
            setStockInput(value);
        }
    };

    const handleProductClick = (id) => {
        setCurrentProductId(id);
        setStockInput(stockFisico[id] || '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentProductId(null);
    };

    const saveStock = () => {
        if (currentProductId !== null) {
            const producto = productos.find(p => p.id === currentProductId);
            if (!producto) return;
    
            // Actualiza solo en el frontend sin hacer un PUT inmediatamente
            setStockFisico(prevState => {
                const updatedStock = { ...prevState, [currentProductId]: stockInput };
                localStorage.setItem('stockFisico', JSON.stringify(updatedStock));
                return updatedStock;
            });

            closeModal();
        }
    };
    
    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            saveStock();
        }
    };

    const handleKeyDown = (e) => {
        if (isModalOpen) return;

        if (e.key === 'ArrowDown') {
            if (selectedRow < productos.length - 1) {
                setSelectedRow(selectedRow + 1);
            }
        } else if (e.key === 'ArrowUp') {
            if (selectedRow > 0) {
                setSelectedRow(selectedRow - 1);
            }
        } else if (e.key === 'Enter' && selectedRow !== null) {
            handleProductClick(productos[selectedRow].id);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedRow, isModalOpen]);

    useEffect(() => {
        if (isModalOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isModalOpen]);

    const saveAllStock = () => {
        // Realiza el PUT al backend para actualizar el stock de todos los productos
        const updates = Object.entries(stockFisico).map(([productId, stock]) => {
            const producto = productos.find(p => p.id === parseInt(productId));
    
            // Si el producto no existe, solo lo omitimos y seguimos con el siguiente
            if (!producto) {
                console.warn(`Producto con ID ${productId} no encontrado.`);
                return Promise.resolve(true); // Continuar sin hacer nada si no se encuentra el producto
            }
    
            const diferencia = stock - producto.stock;
            const tipo = diferencia > 0 ? 'entrada' : 'salida';
    
            return fetch(`http://localhost:5000/api/productos/${productId}/stockInv`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ diferencia, tipo }),  // Enviar tipo y diferencia al backend
            })
            .then(response => response.ok)
            .catch(error => {
                console.error('Error al conectar con el backend:', error);
                return false;  // Retornar false si hay un error
            });
        });
    
        // Espera a que todos los PUTs terminen antes de mostrar el mensaje de éxito
        Promise.all(updates).then(results => {
            if (results.every(result => result)) {
                alert('Todo el inventario ha sido actualizado correctamente.');
            } else {
                alert('Hubo un error al actualizar el inventario.');
            }
        });
    };
    
    

    const categorias = Array.from(new Set(productos.map(p => p.categoria)));

    const filteredProductos = productos.filter((producto) => {
        const matchCategoria = categoriaFiltro ? producto.categoria === categoriaFiltro : true;
        const matchNombre = nombreFiltro ? producto.nombre.toLowerCase().includes(nombreFiltro.toLowerCase()) : true;
        return matchCategoria && matchNombre;
    });

    return (
        <div>
            <header className="bg-blue-600 p-4 text-white text-center w-full">
                <h1 className="text-2xl font-semibold">Gestión de Inventarios</h1>
                <p className="text-sm">Administra tus productos y controla tu inventario</p>
            </header>
            <div className="p-6 max-w-8xl mx-auto bg-white rounded-lg shadow-xl">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Diferencias de Stock</h2>

                <div className="flex gap-4 mb-6">
                    <div className="w-1/2">
                        <input
                            type="text"
                            value={nombreFiltro}
                            onChange={(e) => setNombreFiltro(e.target.value)}
                            placeholder="Buscar por nombre"
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="w-1/2">
                        <select
                            value={categoriaFiltro}
                            onChange={(e) => setCategoriaFiltro(e.target.value)}
                            className="border p-2 w-full"
                        >
                            <option value="">Seleccionar categoría</option>
                            {categorias.map((categoria, index) => (
                                <option key={index} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-auto max-h-80">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border border-gray-400">Producto</th>
                                <th className="py-2 px-4 border border-gray-400">Stock Actual</th>
                                <th className="py-2 px-4 border border-gray-400">Stock Físico</th>
                                <th className="py-2 px-4 border border-gray-400">Diferencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProductos.map((producto, index) => {
                                const diferencia = (stockFisico[producto.id] || 0) - producto.stock;
                                const isLowStock = producto.stock <= producto.stock_minimo;
                                const rowClass = selectedRow === index ? 'bg-blue-100' : 'hover:bg-gray-100';
                                const lowStockClass = isLowStock ? 'bg-red-100' : '';

                                return (
                                    <tr
                                        key={producto.id}
                                        className={`${rowClass} ${lowStockClass} cursor-pointer`}
                                        onClick={() => handleProductClick(producto.id)}
                                        onMouseEnter={() => setSelectedRow(index)}
                                        onMouseLeave={() => setSelectedRow(null)}
                                    >
                                        <td className="py-2 px-4 border border-gray-300">{producto.nombre}</td>
                                        <td className="py-2 px-4 border border-gray-300">{producto.stock}</td>
                                        <td className="py-2 px-4 border border-gray-300">{stockFisico[producto.id] || 0}</td>
                                        <td className="py-2 px-4 border border-gray-300">{diferencia}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">Editar Stock Físico</h3>
                            <input
                                type="number"
                                value={stockInput}
                                onChange={(e) => handleStockFisicoChange(e.target.value)}
                                onKeyDown={handleEnterPress}
                                ref={inputRef}
                                className="border p-2 mb-4 w-full"
                            />
                            <div className="flex justify-between">
                                <button
                                    onClick={saveStock}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow-md"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-6 text-right">
                    <button
                        onClick={saveAllStock}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md"
                    >
                        Guardar Todo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiferenciasStock;
