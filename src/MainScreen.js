import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Función para prevenir la navegación hacia atrás
    const preventBackNavigation = (event) => {
      window.history.pushState(null, '', window.location.href);
    };

    // Bloquea la navegación hacia atrás desde el inicio
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventBackNavigation);

    return () => {
      window.removeEventListener('popstate', preventBackNavigation); // Limpia el evento al desmontar
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    navigate('/auth', { replace: true });
    setTimeout(() => {
      window.history.pushState(null, '', window.location.href);
    }, 100);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenid@</h1>
      <div style={styles.buttonContainer}>
        <button onClick={() => navigate('/form')} style={styles.button}>
          Ir al Formulario
        </button>
        <button onClick={() => navigate('/pedidos')} style={styles.button}>
          Ver Registros
        </button>
        <button onClick={handleLogout} style={styles.buttonLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#F5F5F5',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    color: '#000000',
    marginBottom: 20,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    marginTop: 20,
  },
  button: {
    padding: '12px 24px',
    fontSize: 18,
    borderRadius: 5,
    border: 'none',
    backgroundColor: '#D9B504',
    color: '#FFFFFF',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonLogout: {
    padding: '12px 24px',
    fontSize: 18,
    borderRadius: 5,
    border: 'none',
    backgroundColor: '#FF5733',
    color: '#FFFFFF',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default MainScreen;