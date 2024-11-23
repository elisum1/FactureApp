import React, { useState, useEffect } from 'react';

const ObtenerUsuarios = () => {
    const [users, setUsuarios] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users/getUsers');
            if (response.ok) {
                const data = await response.json();
                setUsuarios(data);
            } else {
                alert('Error al obtener los usuarios');
            }
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:5000/api/users/delete/${userId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    alert('Usuario eliminado exitosamente');
                    fetchUsuarios(); // Actualizar la lista de usuarios
                } else {
                    alert('Error al eliminar el usuario');
                }
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
            }
        }
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/users/update/${selectedUser.numero_usuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedUser)
            });
            if (response.ok) {
                alert('Usuario actualizado exitosamente');
                setIsEditModalOpen(false);
                fetchUsuarios(); // Actualizar la lista de usuarios
            } else {
                alert('Error al actualizar el usuario');
            }
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSelectedUser({
            ...selectedUser,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <div key={user.numero_usuario} className="border rounded-lg p-4 shadow-md bg-white">
                        <p className="text-lg font-semibold">Nombre: {user.nombre}</p>
                        <p className="text-sm text-gray-600">Número de Usuario: {user.numero_usuario}</p>
                        <p className={`text-sm ${user.is_admin ? 'text-green-600' : 'text-red-600'}`}>
                            {user.is_admin ? 'Administrador' : 'Usuario Regular'}
                        </p>
                        <div className="flex space-x-2 mt-4">
                            <button
                                onClick={() => handleEditUser(user)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user.numero_usuario)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isEditModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Editar Usuario</h3>
                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre de Usuario"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedUser.nombre}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <input
                                type="text"
                                name="numero_usuario"
                                placeholder="Número de Usuario"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedUser.numero_usuario}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <input
                                type="password"
                                name="contrasena"
                                placeholder="Contraseña"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedUser.contrasena}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <label className="flex items-center space-x-2 text-gray-700">
                                <input
                                    type="checkbox"
                                    name="is_admin"
                                    checked={selectedUser.is_admin}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span>¿Es Administrador?</span>
                            </label>
                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ObtenerUsuarios;
