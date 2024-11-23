import React, { useEffect, useState, useRef } from 'react';
import MetodoPago from './MetodoDePago';
import FacturaGenerada from './ComponenteFactura/Modal';

const CrearFactura = () => {

    const [facturaExitosa, setFacturaExitosa] = useState(false);
    const [descuentoTotal, setDescuentoTotal] = useState(0);
    const [codigoBarra, setCodigoBarra] = useState('');
    const [nombreProducto, setNombreProducto] = useState('');
    const [costoProducto, setCostoProducto] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [facturaGenerada, setFacturaGenerada] = useState(false);
    const [productosEnFactura, setProductosEnFactura] = useState([]);
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [error, setError] = useState(null);
    const [mostrarMetodoPago, setMostrarMetodoPago] = useState(false);
    const [metodoPago, setMetodoPago] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedMethodIndex, setSelectedMethodIndex] = useState(0); // índice del método de pago seleccionado
    const facturaRef = useRef(null);
    const codigoBarraRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/api/productos')
            .then(response => response.ok ? response.json() : Promise.reject('Error al cargar productos'))
            .then(data => setProductosDisponibles(data.productos))
            .catch(error => console.error('Error al obtener productos:', error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        codigoBarraRef.current?.focus(); // Foco en el input de código de barras
    }, [loading, mostrarMetodoPago, mostrarModal]);


    const limpiarFactura = () => {
        setProductosEnFactura([]);
    };

    const buscarProductoPorCodigo = () => {
        setLoading(true);
        fetch(`http://localhost:5000/api/productos/codigoBarra/${codigoBarra}`)
            .then(response => response.ok ? response.json() : Promise.reject('Producto no encontrado'))
            .then(producto => {
                setNombreProducto(producto.nombre);
                setCostoProducto(producto.costo);
                agregarProductoAFactura(producto);
            })
            .catch(error => {
                console.error('Error al buscar el producto:', error);
                setNombreProducto('');
                setCostoProducto('');
            })
            .finally(() => setLoading(false));
    };


    const ModalProductosDisponibles = ({ productosDisponibles, agregarProductoAFactura, setMostrarModal }) => {
        const [filtroNombre, setFiltroNombre] = useState(''); // Estado para el filtro de nombre
        const filtroRef = useRef(null); // Referencia al input de filtro
        const productosFiltradosRef = useRef([]); // Referencia para los productos filtrados
    
        useEffect(() => {
            if (filtroRef.current) {
                filtroRef.current.focus();
            }
    
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    setMostrarModal(false);
                } else if (e.key === 'Enter') {
                    if (productosFiltradosRef.current.length > 0) {
                        agregarProductoAFactura(productosFiltradosRef.current[0]);
                        setMostrarModal(false);
                    }
                }
            };
    
            document.addEventListener('keydown', handleKeyDown);
    
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }, [setMostrarModal, agregarProductoAFactura]);
    
        const productosFiltrados = productosDisponibles.filter(producto =>
            producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
        );
    
        useEffect(() => {
            productosFiltradosRef.current = productosFiltrados;
        }, [productosFiltrados]);
    
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-md p-6 w-1/2">
                    <h3 className="text-xl mb-4">Seleccionar Producto</h3>
                    
                    {/* Input de filtro por nombre */}
                    <input
                        ref={filtroRef}
                        type="text"
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                        placeholder="Buscar por nombre"
                        className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                    />
    
                    <div className="overflow-y-auto max-h-64 mb-4">
                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map((producto) => (
                                <div
                                    key={producto.id}
                                    className={`flex justify-between items-center py-2 border-b mb-2 ${producto.stock <= producto.stock_minimo ? 'bg-red-400 p-2 rounded-md text-white border-red-600 border-[1px]' : ''}`}
                                >
                                    <div>
                                        <span className="font-semibold mr-6">{producto.nombre}</span>
                                        <span className="text-gray-600 ml-2">Stock: {producto.stock} {producto.unidad}</span>
                                        <span className="text-gray-600 ml-8">Stock mínimo: {producto.stock_minimo}</span>
                                    </div>
                                    
                                    <button
                                        onClick={() => {
                                            agregarProductoAFactura(producto);
                                            setMostrarModal(false);
                                        }}
                                        className="bg-blue-500 text-white px-4 py-1 rounded"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No se encontraron productos.</p>
                        )}
                    </div>
                    
                    <button
                        onClick={() => setMostrarModal(false)}
                        className="mt-4 border-red-600 border-2 text-black px-4 py-2 rounded w-full"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        );
    };
    
    const agregarProductoAFactura = (producto) => {
        setProductosEnFactura(prev => [
            ...prev,
            { id: producto.id, codigoBarra: producto.codigoBarra, nombre: producto.nombre, costo: producto.costo, cantidad: 0 , unidad: producto.unidad }
        ]);
        setCodigoBarra('');
    };

    const eliminarProducto = (id) => {
        setProductosEnFactura(prev => prev.filter(producto => producto.id !== id));
    };

    const actualizarCantidad = (id, cantidad) => {
        setProductosEnFactura(prev =>
            prev.map(producto => 
                producto.id === id ? { ...producto, cantidad } : producto
            )
        );
    };

    const aplicarDescuentoProducto = (id, descuento) => {
        setProductosEnFactura(prev =>
            prev.map(producto => 
                producto.id === id ? { ...producto, descuento } : producto
            )
        );
    };

    const aplicarDescuentoTotal = (descuento) => {
        setDescuentoTotal(descuento);
    };

    const confirmarGeneracionFactura = () => {
        if (productosEnFactura.length === 0) {
            setError('Por favor, añade productos a la factura.');
        } else {
            setMostrarMetodoPago(true);
        }
    };
    
    
    // Función para calcular el total con descuento
    const calcularTotalFactura = () => {
        let total = productosEnFactura.reduce((acc, producto) => {
            const descuentoProducto = producto.descuento || 0;
            const precioConDescuento = producto.costo * (1 - descuentoProducto / 100);
            return acc + precioConDescuento * producto.cantidad;
        }, 0);
    
        total = total * (1 - descuentoTotal / 100);
        return total;
    };
    
    return (
        <div className="flex items-center justify-center h-screen bg-gray-200 p-8">
            <div className="bg-white w-full max-w-7xl rounded-lg shadow-md overflow-hidden flex h-[90%]">
                <div className="w-3/4 p-8 border-r border-gray-300">
                    <FacturaTable
                        productosEnFactura={productosEnFactura}
                        limpiarFactura={limpiarFactura} // Pasamos la función para limpiar la factura
                        eliminarProducto={eliminarProducto}
                        actualizarCantidad={actualizarCantidad}
                        calcularTotal={calcularTotalFactura}
                        aplicarDescuentoProducto={aplicarDescuentoProducto}
                        aplicarDescuentoTotal={aplicarDescuentoTotal}
                    />
                </div>
                <div className="w-1/4 p-8">
                    <FacturaForm
                        codigoBarra={codigoBarra}
                        setCodigoBarra={setCodigoBarra}
                        buscarProductoPorCodigo={buscarProductoPorCodigo}
                        setMostrarModal={setMostrarModal}
                        empresa={empresa}
                        setEmpresa={setEmpresa}
                        confirmarGeneracionFactura={confirmarGeneracionFactura}
                        loading={loading} // Pasar loading a FacturaForm
                    />
                    {facturaGenerada && (
                        <FacturaGenerada 
                            empresa={empresa} 
                            productosEnFactura={productosEnFactura} 
                            total={calcularTotalFactura()} 
                            limpiarFactura={limpiarFactura} // Pasamos la función para limpiar la factura
                        />
                    )}
                    {error && <div className="mt-4 text-red-500">{error}</div>}
                </div>
            </div>
    
            {mostrarModal && (
                <ModalProductosDisponibles
                    productosDisponibles={productosDisponibles}
                    agregarProductoAFactura={agregarProductoAFactura}
                    setMostrarModal={setMostrarModal}
                />
            )}
            {mostrarMetodoPago && (
                <MetodoPago
                    setMetodoPago={setMetodoPago}
                    onConfirm={() => {
                        setMostrarMetodoPago(false);
                        setMostrarConfirmacion(true);
                    }}
                    onCancel={() => setMostrarMetodoPago(false)}
                    montoTotal={calcularTotalFactura()}  // Asegurarse de usar el total con descuento
                />
            )}
            {mostrarConfirmacion && (
       <ModalConfirmacion
    onConfirm={async () => {
        // Calcular el total con descuento
        const totalConDescuento = calcularTotalFactura();
        console.log('Total con descuento calculado:', totalConDescuento);

        // Crear el nombre de los productos con descuento y cantidad
        const nombreProductos = productosEnFactura.map(
            (p) => `${p.nombre} (${p.descuento}% descuento, Cantidad: ${p.cantidad})`
        ).join(', ');
        console.log('Nombre de los productos con descuento y cantidad:', nombreProductos);

        // Crear el objeto de la factura
        const factura = {
            empresa: empresa,
            productos: productosEnFactura.map((p) => ({
                ...p,
                descuento: p.descuento || 0, // Aseguramos que cada producto tenga su descuento
                cantidad: p.cantidad || 1, // Incluimos la cantidad de cada producto
                precio_con_descuento: p.costo * (1 - (p.descuento / 100)), // Calculamos el precio con descuento
            })),
            total: totalConDescuento, // Usar el total con descuento aquí
            nombre: JSON.stringify(productosEnFactura.map((p) => ({
                nombre: p.nombre, // Nombre del producto
                costo: p.costo, // Costo del producto
                cantidad: p.cantidad, // Cantidad del producto
                unidad: p.unidad || 'unidad', // Unidad del producto
                descuento: p.descuento, // Descuento aplicado
                precio_con_descuento: p.costo * (1 - (p.descuento / 100)), // Precio con descuento
            }))),
            metodo: metodoPago,
        };

        console.log('Datos de la factura a enviar con cantidades y precios con descuento:', factura);

        try {
            if (facturaRef.current) {
                console.log('Imprimiendo factura...');
                facturaRef.current.imprimirFactura();
            } else {
                console.warn('Referencia a factura no disponible');
            }

            // Luego, genera la factura en el backend
            const response = await fetch('http://localhost:5000/api/facturas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(factura),
            });

            console.log('Respuesta del backend:', response);

            if (!response.ok) {
                const err = await response.json();
                console.error('Detalle del error:', err);
                throw new Error('Error al crear factura');
            }

            setFacturaExitosa(true)
            setFacturaGenerada(true);
            setError(null);
            setMostrarConfirmacion(false);
            setMostrarModal(false);


            console.log('Factura generada correctamente.');
        } catch (error) {
            console.error('Error al crear factura:', error);
            setError('Error al crear la factura.');
            setMostrarMetodoPago(false);
        } finally {
            setLoading(false);
        }
    }}
    onCancel={() => setMostrarConfirmacion(false)}
/>

)}
{facturaExitosa && (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold">¡Factura enviada con éxito!</h2>
            <p className="mt-2">La factura se ha generado correctamente y ha sido enviada.</p>
            <button
                onClick={() => setFacturaExitosa(false)}
                className="mt-4 bg-white text-green-500 px-4 py-2 rounded-full hover:bg-green-100 transition duration-200"
            >
                Cerrar
            </button>
        </div>
    </div> )}
        </div>
    );
    
}



const ModalConfirmacion = ({ onConfirm, onCancel }) => {
    const modalRef = useRef(null); // Referencia para el modal

    // Manejar el evento de tecla presionada
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                onConfirm(); // Confirmar cuando se presiona Enter
            } else if (e.key === 'Escape') {
                onCancel(); // Cancelar cuando se presiona Escape
            }
        };

        // Enfocar el modal al abrirlo
        modalRef.current?.focus();

        // Añadir el evento de escucha
        document.addEventListener('keydown', handleKeyDown);

        // Limpiar el evento al desmontar el componente
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onConfirm, onCancel]);

    return (
        <div
            ref={modalRef} // Asigna la referencia al modal
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            tabIndex="-1" // Asegura que el modal pueda ser enfocado
        >
            <div className="bg-white rounded-lg shadow-md p-6 w-1/3">
                <h3 className="text-xl">¿Estás seguro de generar la factura?</h3>
                <div className="mt-4 flex justify-between">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={onConfirm}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};


const FacturaTable = ({ productosEnFactura, eliminarProducto, actualizarCantidad, calcularTotal, aplicarDescuentoProducto, aplicarDescuentoTotal }) => {
    

    // Función para eliminar todos los productos
    const eliminarTodosProductos = () => {
        productosEnFactura.forEach(producto => {
            eliminarProducto(producto.id);  // Eliminar cada producto individualmente
        });
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Productos en la Factura:</h3>
            <div className="overflow-x-auto">
                <div className="max-h-[500px] overflow-y-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm text-[.9rem]">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-1 px-4 border-b text-left text-gray-700">Código de Barra</th>
                                <th className="py-1 px-4 border-b text-left text-gray-700">Nombre del Producto</th>
                                <th className="py-1 px-4 border-b text-left text-gray-700">Costo</th>
                                <th className="py-1 px-4 border-b text-left text-gray-700">Cantidad</th>
                                <th className="py-1 px-4 border-b text-left text-gray-700">Unidad</th>
                                <th className="py-1 px-4 border-b text-left text-gray-700">Descuento</th>
                                <th className="py-1 px-4 border-b text-left text-gray-700">Precio con Descuento</th>
                                <th className="py-1 px-4 border-b"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosEnFactura.map((producto) => {
                                const descuento = producto.descuento ?? 0;
                                const precioConDescuento = (producto.costo - (producto.costo * (descuento / 100))) * producto.cantidad;

                                return (
                                    <tr key={producto.id}>
                                        <td className="py-2 px-4 border-b text-[0.8rem]">{producto.codigoBarra}</td>
                                        <td className="py-2 px-4 border-b text-[0.8rem]">{producto.nombre}</td>
                                        <td className="py-2 px-4 border-b text-[0.8rem]">${producto.costo}</td>
                                        <td className="py-2 px-8 border-b text-[0.8rem]">
                                            <input 
                                                className="w-20 border-[1px] border-black"
                                                type="number"
                                                value={producto.cantidad}
                                                onChange={(e) => actualizarCantidad(producto.id, e.target.value)}
                                                min="0"
                                                style={{ MozAppearance: 'textfield' }} 
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b text-[0.8rem]">{producto.unidad}</td>
                                        <td className="py-2 px-4 border-b text-[0.8rem]">
                                            <input
                                                className="w-20 border-[1px] border-black"
                                                type="number"
                                                value={descuento}
                                                onChange={(e) => aplicarDescuentoProducto(producto.id, e.target.value)}
                                                min="0"
                                                style={{ MozAppearance: 'textfield' }} 
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b text-[0.8rem]">
                                            ${precioConDescuento.toFixed(2)}
                                        </td>
                                        <td className="py-2 px-4 border-b text-[0.8rem]">
                                            <button onClick={() => eliminarProducto(producto.id)} className="text-red-500">Eliminar</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 flex justify-between">
                <h4 className="font-semibold text-lg">Total: ${calcularTotal()}</h4>

                {/* Botón para eliminar todos los productos */}
                <button 
                    onClick={eliminarTodosProductos}
                    className="bg-red-500 text-white py-2 px-4 rounded">
                    Eliminar todos los productos
                </button>
            </div>
        </div>
    );
};




const FacturaForm = ({
    codigoBarra,
    setCodigoBarra,
    buscarProductoPorCodigo,
    setMostrarModal,
    empresa,
    setEmpresa,
    confirmarGeneracionFactura,
    imprimirFactura,
    loading
}) => {
    const codigoBarraRef = useRef(null); // Referencia para el input de código de barras

    // Enfocar el input de código de barras al montar el componente
    useEffect(() => {
        codigoBarraRef.current.focus();
    }, []);

    // Manejar el evento de tecla presionada
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                buscarProductoPorCodigo(); // Ejecutar agregar producto al presionar Enter
            } else if (e.key.toLowerCase() === 's') {
                setMostrarModal(true); // Abrir modal al presionar 'S'
            } else if (e.key === ' ') {
                e.preventDefault(); // Evitar la acción por defecto del espacio (scroll)
                confirmarGeneracionFactura(); // Generar factura al presionar espacio
            }
        };

        // Añadir el evento de escucha
        document.addEventListener('keydown', handleKeyDown);

        // Limpiar el evento al desmontar el componente
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [buscarProductoPorCodigo, setMostrarModal, confirmarGeneracionFactura]);

    // Llamar a handlePrint al generar la factura
    const handleGenerateInvoice = () => {
        console.log("Generando factura...");
        confirmarGeneracionFactura();
        setFacturaExitosa(true)
        
    };

    return (
        <div>
            <button className="text-4xl text-center font-extrabold text-white mb-4 w-[100%] bg-blue-600 h-[120px] flex items-center justify-center" onClick={handleGenerateInvoice}>
                <h3>Generar Factura</h3>
            </button>
            <input
                ref={codigoBarraRef} // Asigna la referencia
                type="text"
                value={codigoBarra}
                onChange={(e) => setCodigoBarra(e.target.value)}
                placeholder="Código de Barras"
                className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                disabled={loading}
            />
            <button 
                onClick={buscarProductoPorCodigo} 
                className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4" 
                disabled={loading}
            >
                {loading ? 'Buscando...' : 'Agregar Producto'}
            </button>
            <button 
                onClick={() => setMostrarModal(true)} 
                className="bg-green-500 text-white px-4 py-2 rounded w-full mb-4" 
                disabled={loading}
            >
                Seleccionar Producto
            </button>
            <input
                type="text"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Nombre de la Empresa"
                className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                disabled={loading}
            />
            <button 
                onClick={confirmarGeneracionFactura} 
                className="bg-yellow-500 text-white px-4 py-2 rounded w-full" 
                disabled={loading}
            >
                {loading ? 'Generando...' : 'Generar Factura'}
            </button>
        </div>
    );
};



export default CrearFactura;
