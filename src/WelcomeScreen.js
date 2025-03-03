import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomeScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth'); // Redirige a la pantalla AuthScreen después de 5 segundos
    }, 5000);

    return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.welcomeText}>Bienvenido</h1>
      <img src="Gas.png" alt="Logo" style={styles.logo} />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#024059', // Fondo azul oscuro
  },
  welcomeText: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#D9B504', // Amarillo brillante
    textShadow: '1px 1px 2px #734002', // Sombra marrón oscuro
  },
  logo: {
    width: 500,
    height: 200,
    marginBottom: 20,
    border: '5px solid #BF9004', // Borde dorado
    borderRadius: '50%', // Hace que el logo sea redondeado
    boxShadow: '0 4px 8px #8C5C03', // Sombra marrón
  },
};

export default WelcomeScreen;