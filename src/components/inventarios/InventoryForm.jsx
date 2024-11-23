import React, { useState, useEffect } from 'react';

const Inventarios = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [codigoBarra, setCodigoBarra] = useState('');
    const [nombre, setNombre] = useState('');
    const [costo, setCosto] = useState('');
    const [stockMinimo, setStockMinimo] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [loading, setLoading] = useState(false);
    const [nombreCategoria, setNombreCategoria] = useState('');
    const [editingProducto, setEditingProducto] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);


    // Filtros
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategoria, setFilterCategoria] = useState('');

    // Estado para mostrar el modal de error
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Cargar productos y categorías
    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/api/productos')
            .then(response => response.json())
            .then(data => {
                setProductos(data.productos);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });

        fetch('http://localhost:5000/api/getCategorias')
            .then(response => response.json())
            .then(data => {
                setCategorias(data);
            })
            .catch(error => console.error('Error al cargar categorías:', error));
    }, []);

    // Verificar si el código de barras ya existe
    const verificarCodigoBarra = (codigo) => {
        return productos.some(producto => producto.codigoBarra === codigo);
    };

    // Agregar producto
    const agregarProducto = () => {
        if (verificarCodigoBarra(codigoBarra)) {
            setErrorMessage('El código de barra ya existe en otro producto.');
            setShowErrorModal(true);
            return;
        }

        if (codigoBarra && nombre && costo && categoriaSeleccionada && stockMinimo) {
            setLoading(true);
            fetch('http://localhost:5000/api/productosAdd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codigoBarra,
                    nombre,
                    costo: parseFloat(costo),
                    categoria: categoriaSeleccionada,
                    stock_minimo: parseInt(stockMinimo, 10),
                }),
            })
                .then(response => response.json())
                .then(data => {
                    setProductos([...productos, { ...data }]);
                    limpiarFormulario();
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setLoading(false);
                });
        } else {
            alert('Todos los campos son obligatorios.');
        }
    };

    // Limpiar formulario
    const limpiarFormulario = () => {
        setCodigoBarra('');
        setNombre('');
        setCosto('');
        setStockMinimo('');
        setCategoriaSeleccionada('');
        setEditingProducto(null);
    };

    // Eliminar producto
    const eliminarProducto = id => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            setLoading(true);
            fetch(`http://localhost:5000/api/productos/${id}`, { method: 'DELETE' })
                .then(() => {
                    setProductos(productos.filter(producto => producto.id !== id));
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setLoading(false);
                });
        }
    };

    // Editar producto
    const editarProducto = producto => {
        setEditingProducto(producto);
        setCodigoBarra(producto.codigoBarra);
        setNombre(producto.nombre);
        setCosto(producto.costo);
        setStockMinimo(producto.stock_minimo);
        setCategoriaSeleccionada(producto.categoria);
    };

   
// Actualizar producto
const actualizarProducto = () => {
    if (editingProducto) {
        // Verificar si el nuevo código de barras ya existe en otro producto
        const codigoExistente = productos.find(
            (producto) => producto.codigoBarra === codigoBarra && producto.id !== editingProducto.id
        );

        if (codigoExistente) {
            setErrorMessage('El código de barra ya existe en otro producto.');
            setShowErrorModal(true);
            return;
        }

        setLoading(true);
        fetch(`http://localhost:5000/api/productosUpdate/${editingProducto.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                codigoBarra,
                nombre,
                costo: parseFloat(costo),
                categoria: categoriaSeleccionada,
                stock_minimo: parseInt(stockMinimo, 10),
            }),
        })
        .then((data) => {
            setProductos(productos.map((producto) =>
                producto.id === editingProducto.id
                    ? { ...producto, codigoBarra, nombre, costo, categoria: categoriaSeleccionada, stock_minimo }
                    : producto
            ));
            limpiarFormulario();
            setLoading(false);
            
            // Mostrar mensaje de éxito
            setShowSuccessMessage(true);
            
            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        })
        
    }
};

const eliminarCategoria = (categoriaNombre) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
        setLoading(true);
        fetch(`http://localhost:5000/api/categorias/${categoriaNombre}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setCategorias(categorias.filter(categoria => categoria.categoria !== categoriaNombre));
                    setLoading(false);
                } else {
                    throw new Error('No se pudo eliminar la categoría');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setErrorMessage('Ocurrió un error al eliminar la categoría.');
                setShowErrorModal(true);
                setLoading(false);
            });
    }
};

    // Agregar categoría
    const agregarCategoria = () => {
        if (nombreCategoria) {
            fetch('http://localhost:5000/api/categorias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoria: nombreCategoria }),
            })
                .then(response => response.json())
                .then(data => {
                    setCategorias([...categorias, data]);
                    setNombreCategoria('');
                })
                .catch(error => console.error('Error al crear categoría:', error));
        } else {
            alert('El nombre de la categoría es obligatorio.');
        }
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen">
            <header className="bg-blue-600 w-full p-4 text-white text-center">
                <h1 className="text-2xl font-bold">Gestión de Inventarios</h1>
                <p className="text-sm">Administra tus productos y categorías</p>
            </header>

            {/* Modal de error */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-lg font-semibold text-red-600">{errorMessage}</h3>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-6xl mt-6 px-4">
                {/* Crear Categoría */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Crear Categoría</h2>
                    <div className="flex gap-4 mt-2">
                        <input
                            type="text"
                            value={nombreCategoria}
                            onChange={e => setNombreCategoria(e.target.value)}
                            placeholder="Nombre de la categoría"
                            className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={agregarCategoria}
                            className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600"
                        >
                            Agregar
                        </button>
                    </div>
                </div>


                 {/* Mostrar Categorías */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Categorías</h2>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {categorias.map((categoria) => (
                            <div key={categoria.categoria} className="flex items-center gap-2 bg-gray-200 rounded-lg p-2">
                                <span>{categoria.categoria}</span>
                                <button
                                    onClick={() => eliminarCategoria(categoria.categoria)}
                                    className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Filtros */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Filtros</h2>
                    <div className="flex gap-4 mt-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Buscar por nombre"
                            className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={filterCategoria}
                            onChange={e => setFilterCategoria(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map(categoria => (
                                <option key={categoria.categoria} value={categoria.categoria}>
                                    {categoria.categoria}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tabla de productos */}
                <div className="overflow-y-auto max-h-[300px]">
                    <table className="w-full table-auto border-collapse bg-slate-800">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 text-left">Código</th>
                                <th className="py-2 px-4 text-left">Nombre</th>
                                <th className="py-2 px-4 text-left">Costo</th>
                                <th className="py-2 px-4 text-left">Categoría</th>
                                <th className="py-2 px-4 text-left">Stock</th>
                                <th className="py-2 px-4 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos
                                .filter(producto => producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
                                .filter(producto => !filterCategoria || producto.categoria === filterCategoria)
                                .map(producto => (
                                    <tr key={producto.id} className="border-t text-white">
                                        <td className="py-2 px-4">{producto.codigoBarra}</td>
                                        <td className="py-2 px-4">{producto.nombre}</td>
                                        <td className="py-2 px-4">{producto.costo}</td>
                                        <td className="py-2 px-4">{producto.categoria}</td>
                                        <td className="py-2 px-4">{producto.stock_minimo}</td>
                                        <td className="py-2 px-4">
                                            <button
                                                onClick={() => editarProducto(producto)}
                                                className="bg-yellow-500 text-white rounded px-4 py-2 hover:bg-yellow-600"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => eliminarProducto(producto.id)}
                                                className="bg-red-500 text-white rounded px-4 py-2 ml-2 hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                 
                {/* Formulario para agregar/editar productos */}
                <div className="mt-6">
                    <h2 className="text-xl font-bold text-gray-800">{editingProducto ? 'Editar Producto' : 'Agregar Producto'}</h2>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <input
                            type="text"
                            value={codigoBarra}
                            onChange={e => setCodigoBarra(e.target.value)}
                            placeholder="Código de barra"
                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            placeholder="Nombre del producto"
                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            value={costo}
                            onChange={e => setCosto(e.target.value)}
                            placeholder="Costo"
                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            value={stockMinimo}
                            onChange={e => setStockMinimo(e.target.value)}
                            placeholder="Stock mínimo"
                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                         <select
                                value={categoriaSeleccionada}
                                onChange={e => setCategoriaSeleccionada(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar Categoría</option>
                                {categorias.map(categoria => (
                                    <option key={categoria.categoria} value={categoria.categoria}>
                                        {categoria.categoria}
                                    </option>
                                ))}
                            </select>
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={editingProducto ? actualizarProducto : agregarProducto}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        >
                            {editingProducto ? 'Actualizar Producto' : 'Agregar Producto'}
                        </button>
                        <button
                            onClick={limpiarFormulario}
                            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>
            </div>

            {/* Mensaje de éxito */}
            {showSuccessMessage && (
                <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                    <p>Producto actualizado con éxito!</p>
                </div>
            )}

            {/* Cargar productos de forma condicional */}
            {/* {loading && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="text-white font-semibold text-lg">Cargando...</div>
                </div>
            )} */}
        </div>
    );
};

export default Inventarios;
