import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './WelcomeScreen'; // Importa el componente de bienvenida
import AuthScreen from './AuthScreen';
import MainScreen from './MainScreen';
import FromScreen from './FormScreen';
import PedidosScreen from './PedidosScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} /> 
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/main" element={<MainScreen />} />
        <Route path="/form" element={<FromScreen />} />
        <Route path="/pedidos" element={<PedidosScreen />} />
      </Routes>
    </Router>
  );
}

export default App;