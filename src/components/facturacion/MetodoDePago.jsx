import React, { useState, useEffect, useRef } from 'react';

const MetodoPago = ({ setMetodoPago, onConfirm, onCancel, totalFactura }) => {
    const [efectivo, setEfectivo] = useState(0);
    const [dataphone, setDataphone] = useState(0);
    const [transferencia, setTransferencia] = useState(0);
    const [metodoSeleccionado, setMetodoSeleccionado] = useState('');
    const buttonRefs = useRef([]); // Ref for each button

    useEffect(() => {
        if (buttonRefs.current[0]) {
            buttonRefs.current[0].focus(); // Focus the first button initially
        }
    }, []);

    const manejarConfirmacion = () => {
        if (metodoSeleccionado) {
            if (metodoSeleccionado === 'Combinado') {
                const totalPagado = efectivo + dataphone + transferencia;
                if (totalPagado === totalFactura) {
                    setMetodoPago(`Efectivo: $${efectivo}, Datafono: $${dataphone}, Transferencia: $${transferencia}`);
                    onConfirm();
                } else {
                    alert(`El monto total no coincide con el total de la factura ($${totalFactura}). Por favor, ajuste los valores.`);
                }
            } else {
                setMetodoPago(metodoSeleccionado);
                onConfirm();
            }
        } else {
            alert('Por favor, selecciona un método de pago.');
        }
    };

    const seleccionarMetodoPago = (metodo) => {
        setMetodoSeleccionado(metodo);
    };

    const manejarNavegacionTeclado = (e, index) => {
        if (e.key === 'ArrowRight') {
            const nextIndex = (index + 1) % buttonRefs.current.length;
            buttonRefs.current[nextIndex].focus();
        } else if (e.key === 'ArrowLeft') {
            const prevIndex = (index - 1 + buttonRefs.current.length) % buttonRefs.current.length;
            buttonRefs.current[prevIndex].focus();
        } else if (e.key === 'Enter') {
            seleccionarMetodoPago(buttonRefs.current[index].textContent);
            manejarConfirmacion(); // Confirmar selección al presionar Enter
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-1/3">
                <h3 className="text-xl font-semibold mb-4">Método de Pago</h3>
                <div className="mb-4 flex gap-2">
                    {['Efectivo', 'Datafono', 'Transferencia'].map((metodo, index) => (
                        <button
                            key={metodo}
                            ref={(el) => (buttonRefs.current[index] = el)}
                            onClick={() => seleccionarMetodoPago(metodo)}
                            onKeyDown={(e) => manejarNavegacionTeclado(e, index)}
                            className={`px-4 py-2 rounded ${
                                metodoSeleccionado === metodo ? 'bg-green-600' : 'bg-green-500'
                            } text-white`}
                        >
                            {metodo}
                        </button>
                    ))}
                </div>
                {metodoSeleccionado === 'Combinado' && (
                    <div className="mb-4">
                        <div className="mb-4">
                            <label className="block mb-1">Efectivo:</label>
                            <input
                                type="number"
                                min="0"
                                value={efectivo}
                                onChange={(e) => setEfectivo(parseFloat(e.target.value) || 0)}
                                className="border p-2 rounded w-full appearance-none"
                                inputMode="decimal"
                                style={{ MozAppearance: 'textfield' }} // Para Firefox
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Datáfono:</label>
                            <input
                                type="number"
                                min="0"
                                value={dataphone}
                                onChange={(e) => setDataphone(parseFloat(e.target.value) || 0)}
                                className="border p-2 rounded w-full appearance-none"
                                inputMode="decimal"
                                style={{ MozAppearance: 'textfield' }} // Para Firefox
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Transferencia:</label>
                            <input
                                type="number"
                                min="0"
                                value={transferencia}
                                onChange={(e) => setTransferencia(parseFloat(e.target.value) || 0)}
                                className="border p-2 rounded w-full appearance-none"
                                inputMode="decimal"
                                style={{ MozAppearance: 'textfield' }} // Para Firefox
                            />
                        </div>
                    </div>
                )}
                <div className="flex justify-end">
                    <button onClick={onCancel} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Cancelar</button>
                    <button onClick={manejarConfirmacion} className="bg-blue-500 text-white px-4 py-2 rounded">Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default MetodoPago;
