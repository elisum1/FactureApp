// src/components/ProveedorDashboard.jsx
import React, { useState } from 'react';
import { FaUserPlus, FaHistory, FaTruck, FaBars, FaTimes } from 'react-icons/fa';
import CrearProveedor from '../proveedores/CrearProveedor';
import HistorialPedidos from '../proveedores/HistorialPedidos';
import SeguimientoEntregas from '../proveedores/SeguimientoEntregas';

const ProveedorDashboard = ({ onBackToMenu }) => {
    const [selectedComponent, setSelectedComponent] = useState('CrearProveedor');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'CrearProveedor':
                return <CrearProveedor />;
            case 'HistorialPedidos':
                return <HistorialPedidos />;
            case 'SeguimientoEntregas':
                return <SeguimientoEntregas />;
            default:
                return <div>Componente no encontrado</div>;
        }
    };

    return (
        <div className="flex h-screen w-full">
            <nav className={`flex flex-col items-center p-4 bg-blue-600 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-white hover:text-blue-400 mb-4"
                >
                    {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
                </button>
                
                <h2 className={`text-2xl font-bold mb-6 transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                    Proveedores
                </h2>
                
                <button
                    onClick={() => setSelectedComponent('CrearProveedor')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaUserPlus size={20} />
                    {!isCollapsed && <span>Crear Proveedor</span>}
                </button>
                
                <button
                    onClick={() => setSelectedComponent('HistorialPedidos')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaHistory size={20} />
                    {!isCollapsed && <span>Historial de Pedidos</span>}
                </button>
                
                <button
                    onClick={() => setSelectedComponent('SeguimientoEntregas')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaTruck size={20} />
                    {!isCollapsed && <span>Seguimiento de Entregas</span>}
                </button>
                
                <button 
                    onClick={() => onBackToMenu()}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaBars size={20} />
                    {!isCollapsed && <span>Menú</span>}
                </button>
            </nav>

            <main className="w-full bg-gray-100">
                {renderComponent()}
            </main>
        </div>
    );
};

export default ProveedorDashboard;
