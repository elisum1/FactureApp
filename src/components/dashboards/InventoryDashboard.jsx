// src/components/InventoryDashboard.jsx
import React, { useState } from 'react';
import { FaBox, FaExchangeAlt, FaBalanceScale, FaBars, FaTimes } from 'react-icons/fa';
import CrearProductos from '../inventarios/InventoryForm';
import EntradasSalidas from '../inventarios/EntradasSalidas';
import DiferenciasStock from '../inventarios/DiferenciasStock';

const InventoryDashboard = ({ onBackToMenu }) => {
    const [selectedComponent, setSelectedComponent] = useState('CrearProductos');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'CrearProductos':
                return <CrearProductos />;
            case 'EntradasSalidas':
                return <EntradasSalidas />;
            case 'DiferenciasStock':
                return <DiferenciasStock />;
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
                    Inventarios
                </h2>
                
                <button
                    onClick={() => setSelectedComponent('CrearProductos')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaBox size={20} />
                    {!isCollapsed && <span>Crear Productos</span>}
                </button>
                
                <button
                    onClick={() => setSelectedComponent('EntradasSalidas')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaExchangeAlt size={20} />
                    {!isCollapsed && <span>Entradas y Salidas</span>}
                </button>
                
                <button
                    onClick={() => setSelectedComponent('DiferenciasStock')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaBalanceScale size={20} />
                    {!isCollapsed && <span>Diferencias de Stock</span>}
                </button>
                
                <button 
                    onClick={() => onBackToMenu()}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaBars size={20} />
                    {!isCollapsed && <span>Menu</span>}
                </button>
            </nav>

            <main className="w-full bg-gray-100">
                {renderComponent()}
            </main>
        </div>
    );
};

export default InventoryDashboard;
