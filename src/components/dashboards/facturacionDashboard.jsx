// src/components/FacturacionDashboard.jsx
import React, { useState } from 'react';
import { FaFileInvoice, FaEye, FaCashRegister, FaTimes, FaBars, FaBoxOpen } from 'react-icons/fa';
import CrearFactura from "../facturacion/CrearFactura";
import ArqueoDeCaja from "../facturacion/ArqueoDeCaja";
import CierreDeCajaDefinitivo from "../facturacion/CierreDeCajaDefinitivo";
import ListaFacturas from '../facturacion/VerFacturas';

const FacturacionDashboard = ({ onBackToMenu }) => {
    const [selectedComponent, setSelectedComponent] = useState('CrearFactura');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'CrearFactura':
                return <CrearFactura />;
            case 'VerFacturas':
                return <ListaFacturas />;
            case 'ArqueoDeCaja':
                return <ArqueoDeCaja />;
            case 'CierreDeCajaDefinitivo':
                return <CierreDeCajaDefinitivo />;
            default:
                return <div>Componente no encontrado</div>;
        }
    };

    return (
        <div className="flex h-screen w-full">
            <nav className={`flex flex-col items-center p-4 bg-blue-600 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-white hover:text-black mb-4"
                >
                    {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
                </button>
                
                <h2 className={`text-2xl font-bold mb-6 transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                    Facturación
                </h2>
                
                <button
                    onClick={() => setSelectedComponent('CrearFactura')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-black"
                >
                    <FaFileInvoice size={20} />
                    {!isCollapsed && <span>Crear Factura</span>}
                </button>
                
                <button
                    onClick={() => setSelectedComponent('VerFacturas')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-black"
                >
                    <FaEye size={20} />
                    {!isCollapsed && <span>Ver Facturas</span>}
                </button>
                
                <button
                    onClick={() => setSelectedComponent('ArqueoDeCaja')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-black"
                >
                    <FaCashRegister size={20} />
                    {!isCollapsed && <span>Arqueo de Caja</span>}
                </button>
                
                
                <button
                    onClick={() => setSelectedComponent('CierreDeCajaDefinitivo')}
                    className="flex items-center  mb-4 text-white hover:text-black"
                >
                    <FaTimes size={20} />
                    {!isCollapsed && <span>Cierre de Caja Definitivo</span>}
                </button>
                
                <button
                    onClick={() => {
                        onBackToMenu();
                    }}
                    className="flex items-center gap-2 mb-4 text-white hover:text-black"
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

export default FacturacionDashboard;
