import React, { useState } from 'react';

const RegistrarUsuario = () => {
    const [nombre, setNombre] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [numeroUsuario, setNumeroUsuario] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    numero_usuario: numeroUsuario || Math.floor(Math.random() * 100000),
                    nombre,
                    contrasena,
                    is_admin: isAdmin ? 1 : 0
                })
            });
            if (response.ok) {
                alert('Usuario registrado exitosamente');
                setNombre('');
                setContrasena('');
                setNumeroUsuario('');
                setIsAdmin(false);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Error al registrar el usuario'}`);
            }
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            alert('Error al registrar el usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">Registrar Usuario</h2>
                <form onSubmit={handleRegister} className="space-y-5">
                    <input
                        type="text"
                        placeholder="Número de Usuario Único"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={numeroUsuario}
                        onChange={(e) => setNumeroUsuario(e.target.value)}
                        disabled={isLoading}
                    />
                    <input
                        type="text"
                        placeholder="Nombre de Usuario"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        disabled={isLoading}
                    />
                    <label className="flex items-center space-x-2 text-gray-700">
                        <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={() => setIsAdmin(!isAdmin)}
                            disabled={isLoading}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span>¿Es Administrador?</span>
                    </label>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Cargando...' : 'Registrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistrarUsuario;
