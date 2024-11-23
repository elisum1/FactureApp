import React, { useState, useEffect, useRef } from 'react';
import { FaBox, FaFileInvoiceDollar, FaTruck, FaUser, FaKeyboard, FaPowerOff, FaSignInAlt } from 'react-icons/fa';
import FacturacionDashboard from './dashboards/facturacionDashboard.jsx';
import InventoryDashboard from './dashboards/InventoryDashboard';
import ProveedoresDashboard from './dashboards/proveedoresDashboard';
import UsuariosDashboard from './dashboards/usuariosDashboard';

// Componente de pantalla de bienvenida
const WelcomeScreen = ({ onFinish }) => {
    const [letters, setLetters] = useState([]);
    const welcomeText = 'Maauro Services';

    useEffect(() => {
        const timer = setTimeout(onFinish, 7000);

        let index = 0;
        const interval = setInterval(() => {
            if (index < welcomeText.length) {
                setLetters((prev) => [...prev, welcomeText[index]]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [onFinish]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-white relative font-poppins">
            <div className="text-center text-blue-600">
                <FaKeyboard size={100} className="mb-6 text-blue-600 animate-pulse" />
                <h1 className="text-8xl font-extrabold tracking-wide">
                    {letters.map((letter, index) => (
                        <span
                            key={index}
                            className="inline-block"
                            style={{
                                animation: `wave 1s ease-in-out ${index * 0.1}s forwards`,
                                transform: 'translateY(0)',
                                display: 'inline-block',
                            }}>
                            {letter}
                        </span>
                    ))}
                </h1>
                <div className="flex justify-center mt-10">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            </div>

            <style>
                {`
                    @keyframes wave {
                        0% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-20px);
                        }
                        100% {
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </div>
    );
};

const MenuButton = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center text-blue-600 bg-white hover:bg-blue-100 p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105 font-extrabold">
        {icon}
        <span className="mt-2 text-sm">{label}</span>
    </button>
);

const LoginForm = ({ onLogin, errorMessage, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-500">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-xs w-full">
                <h2 className="text-2xl font-extrabold text-center text-blue-600 mb-6">Iniciar sesión</h2>
                {errorMessage && <div className="text-red-600 text-center mb-4">{errorMessage}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Número de Usuario"
                        className="p-2 border-2 border-gray-300 rounded"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="p-2 border-2 border-gray-300 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-4">Iniciar sesión</button>
                </form>
                <button
                    onClick={onBack}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-center block">
                    Regresar al menú
                </button>
            </div>
        </div>
    );
};

const MainMenu = () => {
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [showWelcome, setShowWelcome] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loggedUser, setLoggedUser] = useState(null); // Guardar datos del usuario
    const [pendingComponent, setPendingComponent] = useState(null);

    useEffect(() => {
        // Se ejecuta cada vez que el usuario vuelve al menú principal
        console.log('Main menu renderizado');
    }, []);

    const handleLogin = async (username, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numero_usuario: username, contrasena: password }),
            });

            const data = await response.json();

            if (response.ok) {
                setLoggedUser(data.user);
                setIsAdmin(data.user.is_admin);
                setShowLogin(false);
                setSelectedComponent(pendingComponent);
            } else {
                setLoginError(data.error);
            }
        } catch (err) {
            console.error('Error al hacer login:', err);
            setLoginError('Hubo un error al intentar iniciar sesión. Intenta de nuevo.');
        }
    };

    const handleModuleAccess = (module) => {
        if (isAdmin || module === 'Facturación') {
            setSelectedComponent(module);
        } else {
            setPendingComponent(module);
            setShowLogin(true);
        }
    };

    const renderDashboard = () => {
        switch (selectedComponent) {
            case 'Inventarios':
                return <InventoryDashboard onBackToMenu={() => setSelectedComponent(null)} />;
            case 'Facturación':
                return <FacturacionDashboard onBackToMenu={() => setSelectedComponent(null)} />;
            case 'Proveedores':
                return <ProveedoresDashboard onBackToMenu={() => setSelectedComponent(null)} />;
            case 'Usuarios':
                return <UsuariosDashboard onBackToMenu={() => setSelectedComponent(null)} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 font-poppins">
            {showWelcome ? (
                <WelcomeScreen onFinish={() => setShowWelcome(false)} />
            ) : selectedComponent ? (
                <div className="w-full">
                    {renderDashboard()}
                </div>
            ) : showLogin ? (
                <LoginForm
                    onLogin={handleLogin}
                    errorMessage={loginError}
                    onBack={() => setShowLogin(false)}
                />
            ) : (
                <div className="min-h-screen flex items-center justify-center bg-blue-600">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-8 mb-4">
                            <div className="flex items-center justify-center w-28 h-28 bg-blue-950 rounded-full shadow-lg mb-20">
                                <FaKeyboard size={80} className="text-white" />
                            </div>
                            <h1 className="text-6xl font-extrabold text-white mb-20">Mauro Services</h1>
                        </div>

                        <div className="grid grid-cols-3 gap-6 max-w-2xl h-[450px] text-center">
                            <MenuButton icon={<FaBox size={60} />} label="Inventarios" onClick={() => handleModuleAccess('Inventarios')} />
                            <MenuButton icon={<FaFileInvoiceDollar size={60} />} label="Facturación" onClick={() => handleModuleAccess('Facturación')} />
                            <MenuButton icon={<FaTruck size={60} />} label="Proveedores" onClick={() => handleModuleAccess('Proveedores')} />
                            <MenuButton icon={<FaUser size={60} />} label="Usuarios" onClick={() => handleModuleAccess('Usuarios')} />
                            <MenuButton icon={<FaPowerOff size={60} />} label="Salir de la Aplicación" onClick={() => window.close()} />
                            <MenuButton icon={<FaSignInAlt size={60} />} label="Iniciar Sesión" onClick={() => setShowLogin(true)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainMenu;
