// src/App.jsx
import React, { useState, useEffect } from 'react';
import InventoryDashboard from './components/dashboards/InventoryDashboard';
import MainMenu from './components/MainMenu';

function App() {
    const [showInventory, setShowInventory] = useState(false);

    const handleEnterDashboard = () => {
        setShowInventory(true);
    };

    const handleBackToMenu = () => {
        setShowInventory(false);
    };

    useEffect(() => {
        // Función para activar el modo de pantalla completa
        const enterFullScreen = () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen();
            }
        };

        // Solo activar pantalla completa al cargar el componente
        enterFullScreen();
    }, []); // Solo ejecutará esto una vez al montar el componente

    return (
        <div className="App">
            {showInventory ? (
                <InventoryDashboard onBackToMenu={handleBackToMenu} />
            ) : (
                <MainMenu onEnterDashboard={handleEnterDashboard} />
            )}
        </div>
    );
}

export default App;
