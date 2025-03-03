import React, { useState, useEffect } from 'react';
import API_URL from './config'; // Importa la URL de la API

const FormScreen = () => {
  const [formData, setFormData] = useState({
    Fecha: '',
    TipoServicio: '',
    Colonia: '',
    Direccion: '',
    Nombre: '',
    Telefono: '',
    Observaciones: '',
  });

  const [historico, setHistorico] = useState([]);

  const getLocalDate = () => {
    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    return hoy.toISOString().split('T')[0];
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      Fecha: getLocalDate(),
    }));
    fetchHistorico();
  }, []);

  const fetchHistorico = async () => {
    try {
      const response = await fetch(`${API_URL}/consultar_pedidos`); // Usa API_URL
      const data = await response.json();
      if (response.ok) {
        const pedidosArray = Object.values(data).flat();
        setHistorico(pedidosArray);
      }
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (['Nombre', 'Colonia', 'Direccion', 'Telefono'].includes(name)) {
      handleAutocomplete(name, value);
    }
  };

  const handleAutocomplete = (campo, valor) => {
    const coincidencia = historico.find((item) => item[campo]?.toLowerCase() === valor.toLowerCase());
    if (coincidencia) {
      setFormData((prevData) => ({
        ...prevData,
        ...coincidencia,
        Fecha: getLocalDate(),
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.Nombre || !formData.Direccion || !formData.Telefono) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    const horaRegistro = new Date().toLocaleTimeString();
    const dataToSend = { ...formData, Hora: horaRegistro };

    try {
      const response = await fetch(`${API_URL}/guardar_pedido`, { // Usa API_URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setHistorico([...historico, dataToSend]);
        resetForm();
      } else {
        alert(result.message || 'Error al guardar el pedido.');
      }
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      alert('Ocurrió un error.');
    }
  };

  const resetForm = () => {
    setFormData({
      Fecha: getLocalDate(),
      TipoServicio: '',
      Colonia: '',
      Direccion: '',
      Nombre: '',
      Telefono: '',
      Observaciones: '',
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Registrar Pedido</h1>
      <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
        <input name="Fecha" type="date" value={formData.Fecha} onChange={handleChange} style={styles.input} />
        <select name="TipoServicio" value={formData.TipoServicio} onChange={handleChange} style={styles.input}>
          <option value="">Selecciona Tipo de Servicio</option>
          <option value="Cilindro">Cilindro</option>
          <option value="Estacionario">Estacionario</option>
        </select>
        <input name="Colonia" type="text" placeholder="Colonia" value={formData.Colonia} onChange={handleChange} style={styles.input} />
        <input name="Direccion" type="text" placeholder="Dirección" value={formData.Direccion} onChange={handleChange} style={styles.input} />
        <input name="Nombre" type="text" placeholder="Nombre" value={formData.Nombre} onChange={handleChange} style={styles.input} />
        <input name="Telefono" type="tel" placeholder="Teléfono" value={formData.Telefono} onChange={handleChange} style={styles.input} />
        <textarea name="Observaciones" placeholder="Observaciones" value={formData.Observaciones} onChange={handleChange} style={styles.textarea} />
        <button type="button" onClick={handleSubmit} style={styles.button}>Guardar Pedido</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#000',
    textAlign: 'center',
  },
  form: {
    width: '90%',
    maxWidth: '600px',
    display: 'grid',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #00446A',
    borderRadius: '5px',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #00446A',
    borderRadius: '5px',
    width: '100%',
    height: '100px',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#00446A',
    color: '#FFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default FormScreen;