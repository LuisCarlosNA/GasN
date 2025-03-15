import React, { useEffect, useState } from "react";
import API_URL from "./config"; // Importa la URL base desde el archivo de configuración

const PedidosScreen = () => {
  const [pedidos, setPedidos] = useState({});
  const [loading, setLoading] = useState(true);
  const [dataExterna, setDataExterna] = useState(null);

  useEffect(() => {
    const pedidosGuardados = localStorage.getItem("pedidos");
    if (pedidosGuardados) {
      setPedidos(JSON.parse(pedidosGuardados));
      setLoading(false);
    } else {
      fetchPedidos();
    }
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_URL}/consultar_pedidos`);
      const data = await response.json();

      if (response.ok) {
        setPedidos(data);
        savePedidosToLocalStorage(data); // Guardar los pedidos en localStorage
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error al consultar los pedidos:", error);
      alert("Ocurrió un error al consultar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const savePedidosToLocalStorage = (data) => {
    localStorage.setItem("pedidos", JSON.stringify(data)); // Guardar en localStorage
  };

  const fetchDataExterna = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (response.ok) {
        setDataExterna(data);
      } else {
        alert("Error al obtener datos de la API externa.");
      }
    } catch (error) {
      console.error("Error al consultar la API externa:", error);
      alert("Ocurrió un error al consultar la API externa.");
    }
  };

  const eliminarPedido = async (fecha, index) => {
    try {
      const response = await fetch(`${API_URL}/eliminar_pedido`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Fecha: fecha, Index: index }),
      });

      if (response.ok) {
        alert("Pedido eliminado correctamente.");
        fetchPedidos();
      } else {
        alert("Error al eliminar el pedido.");
      }
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
      alert("Ocurrió un error al eliminar el pedido.");
    }
  };

  const actualizarEstatus = async (fecha, index, nuevoEstatus) => {
    if (nuevoEstatus === "Cancelado") {
      eliminarPedido(fecha, index);
      return;
    }

    try {
      await fetch(`${API_URL}/actualizar_estatus`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Fecha: fecha, Index: index, Estatus: nuevoEstatus }),
      });

      alert("Estatus actualizado correctamente.");
      fetchPedidos();
    } catch (error) {
      console.error("Error al actualizar el estatus:", error);
      alert("Ocurrió un error al actualizar el estatus.");
    }
  };

  const descargarExcel = async () => {
    try {
      const response = await fetch(`${API_URL}/descargar_excel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidos),
      });

      if (!response.ok) {
        throw new Error("Error al generar el archivo Excel.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Pedidos.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      alert("Ocurrió un error al intentar descargar el archivo.");
    }
  };

  const actualizarExcel = async () => {
    try {
      const response = await fetch(`${API_URL}/actualizar_excel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidos),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el archivo Excel.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Pedidos_actualizados.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al actualizar el archivo:", error);
      alert("Ocurrió un error al intentar actualizar el archivo.");
    }
  };

  const eliminarPedidosPorFecha = async (fecha) => {
    try {
      const response = await fetch(`${API_URL}/eliminar_pedidos_fecha`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Fecha: fecha }),
      });

      if (response.ok) {
        alert("Todos los pedidos de la fecha han sido eliminados.");
        fetchPedidos();
      } else {
        alert("Error al eliminar los pedidos.");
      }
    } catch (error) {
      console.error("Error al eliminar los pedidos:", error);
      alert("Ocurrió un error al eliminar los pedidos.");
    }
  };

  if (loading) {
    return <p style={styles.loading}>Cargando pedidos...</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pedidos por Fecha</h1>
      {Object.keys(pedidos).length === 0 ? (
        <p style={styles.noPedidos}>No hay pedidos registrados.</p>
      ) : (
        Object.keys(pedidos).map((fecha, index) => {
          const pedidosFecha = pedidos[fecha];

          // Calcular el resumen
          const totalPedidos = pedidosFecha.length;
          const cilindros = pedidosFecha.filter((p) => p.TipoServicio === "Cilindro").length;
          const estacionarios = pedidosFecha.filter((p) => p.TipoServicio === "Estacionario").length;

          return (
            <div key={index} style={styles.tableContainer}>
              <h2 style={styles.subtitle}>Pedidos del {fecha}</h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Hora</th>
                    <th style={styles.th}>Tipo de Servicio</th>
                    <th style={styles.th}>Colonia</th>
                    <th style={styles.th}>Dirección</th>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Teléfono</th>
                    <th style={styles.th}>Observaciones</th>
                    <th style={styles.th}>Estatus</th>
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFecha.map((pedido, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}>{pedido.Hora}</td>
                      <td style={styles.td}>{pedido.TipoServicio}</td>
                      <td style={styles.td}>{pedido.Colonia}</td>
                      <td style={styles.td}>{pedido.Direccion}</td>
                      <td style={styles.td}>{pedido.Nombre}</td>
                      <td style={styles.td}>{pedido.Telefono}</td>
                      <td style={styles.td}>{pedido.Observaciones}</td>
                      <td style={styles.td}>
                        <select
                          value={pedido.Estatus}
                          onChange={(e) => actualizarEstatus(fecha, idx, e.target.value)}
                          style={styles.select}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td style={styles.td}>
                        <button onClick={() => eliminarPedido(fecha, idx)} style={styles.deleteButton}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={() => eliminarPedidosPorFecha(fecha)}
                style={styles.deleteAllButton}
              >
                Eliminar Todos los Pedidos de {fecha}
              </button>

              {/* Resumen debajo de la tabla */}
              <div style={styles.summaryContainer}>
                <p style={styles.summaryText}><strong>{fecha}</strong></p>
                <p style={styles.summaryText}>Llamadas totales: {totalPedidos}</p>
                <p style={styles.summaryText}>Cilindros: {cilindros}</p>
                <p style={styles.summaryText}>Estacionarios: {estacionarios}</p>
              </div>
            </div>
          );
        })
      )}
      <button type="button" onClick={descargarExcel} style={styles.button}>
        Descargar Excel
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2rem",
    textAlign: "center",
    marginBottom: "20px",
  },
  tableContainer: {
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  th: {
    backgroundColor: "#031D40",
    color: "#FFF",
    border: "1px solid #000",
    padding: "10px",
  },
  td: {
    border: "1px solid #000",
    padding: "10px",
    textAlign: "left",
  },
  select: {
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#F44336",
    color: "#FFF",
    border: "none",
    cursor: "pointer",
  },
  deleteAllButton: {
    padding: "5px 10px",
    backgroundColor: "#F44336",
    color: "#FFF",
    border: "none",
    cursor: "pointer",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#FFF",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  summaryContainer: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#f4f4f4",
    borderRadius: "4px",
  },
  summaryText: {
    fontSize: "14px",
    marginBottom: "5px",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.5rem",
  },
  noPedidos: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#FF5722",
  },
};

export default PedidosScreen;