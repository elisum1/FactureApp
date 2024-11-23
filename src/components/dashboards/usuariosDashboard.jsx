import React, { useState } from 'react';
import { FaUserPlus, FaUsers, FaBars, FaTimes, FaFileInvoice } from 'react-icons/fa'; // Añade el icono de factura
import RegistrarUsuario from '../usuarios/RegistrarUsuario';
import ObtenerUsuarios from '../usuarios/ObtenerUsuarios';
import GestionarFactura from '../usuarios/RegistrarFactura';
import CierresGenerados from '../usuarios/verificarCierresDefinitivos';
import Fact from '../usuarios/Facturas';

const UsuariosDashboard = ({ onBackToMenu }) => {
    const [selectedComponent, setSelectedComponent] = useState('RegistrarUsuario');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'RegistrarUsuario':
                return <RegistrarUsuario />;
            case 'ObtenerUsuarios':
                return <ObtenerUsuarios />;
            case 'RegistrarFactura':
                return <GestionarFactura />;
            case 'Facturas':
                return <Fact />;
            case 'verificarCierresDefinitivos':
                return <CierresGenerados/>;
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
                    Usuarios
                </h2>
                
                <button
                    onClick={() => setSelectedComponent('RegistrarUsuario')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaUserPlus size={20} />
                    {!isCollapsed && <span>Registrar Usuario</span>}
                </button>
                
                <button
                    onClick={() => setSelectedComponent('ObtenerUsuarios')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaUsers size={20} />
                    {!isCollapsed && <span>Obtener Usuarios</span>}
                </button>

                <button
                    onClick={() => setSelectedComponent('RegistrarFactura')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaFileInvoice size={20} />
                    {!isCollapsed && <span>Registrar Factura</span>}
                </button>


                <button
                    onClick={() => setSelectedComponent('Facturas')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaFileInvoice size={20} />
                    {!isCollapsed && <span>Ver y eliminar Facturas</span>}
                </button>

                <button
                    onClick={() => setSelectedComponent('verificarCierresDefinitivos')}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaFileInvoice size={20} />
                    {!isCollapsed && <span>Cierres</span>}
                </button>
                
                <button 
                    onClick={() => onBackToMenu()}
                    className="flex items-center gap-2 mb-4 text-white hover:text-blue-400"
                >
                    <FaBars size={20} />
                    {!isCollapsed && <span>Menú</span>}
                </button>
            </nav>

            <main className="w-full bg-gray-100 p-6">
                {renderComponent()}
            </main>
        </div>
    );
};

export default UsuariosDashboard;
