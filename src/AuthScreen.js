import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const navigate = useNavigate();

  // Validación de correo
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@(gasnoel\.com|gmail\.com)$/.test(email);

  // Validación de contraseña segura
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const sendRecoveryEmail = (email, name, password) => {
    emailjs
      .send(
        "service_z751ekd",
        "template_ffkboz8",
        { email, name, password },
        "yXNRgG_oI_XlrZuok"
      )
      .then((response) => {
        console.log("Correo enviado con éxito:", response);
        alert("Se ha enviado un enlace de recuperación a tu correo electrónico.");
      })
      .catch((error) => {
        console.error("Error al enviar correo:", error);
        setErrorMessage("Hubo un problema al enviar el correo. Intenta nuevamente.");
      });
  };

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Por favor completa todos los campos.");
      setTimeout(() => setErrorMessage(""), 5000);  // El mensaje se borra después de 5 segundos
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("El correo debe ser del dominio @gasnoel.com o @gmail.com.");
      setTimeout(() => setErrorMessage(""), 5000);  // El mensaje se borra después de 5 segundos
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      setTimeout(() => setErrorMessage(""), 5000);  // El mensaje se borra después de 5 segundos
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres, incluir números, y contener letras mayúsculas y minúsculas.");
      setTimeout(() => setErrorMessage(""), 5000);  // El mensaje se borra después de 5 segundos
      return;
    }

    const newUser = { name, email, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setErrorMessage("");

    alert("Registro exitoso.");
    setIsLogin(true);
  };

  const handleLogin = () => {
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      setErrorMessage("");
      navigate("/main");
    } else {
      setErrorMessage(
        users.find((user) => user.email === email)
          ? "Contraseña incorrecta."
          : "Correo no registrado."
      );
      setTimeout(() => setErrorMessage(""), 5000);  // El mensaje se borra después de 5 segundos
    }
  };

  const handleRecoverPassword = () => {
    if (!validateEmail(recoveryEmail)) {
      setErrorMessage("Por favor, introduce un correo válido.");
      setTimeout(() => setErrorMessage(""), 5000);  // El mensaje se borra después de 5 segundos
      return;
    }

    const user = users.find((user) => user.email === recoveryEmail);
    if (user) {
      sendRecoveryEmail(recoveryEmail, user.name, user.password);
      setIsRecoveringPassword(false);
      setRecoveryEmail("");
    } else {
      setErrorMessage("Correo no registrado.");
      setTimeout(() => setErrorMessage(""), 5000);  // El mensaje se borra después de 5 segundos
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {isLogin
          ? isRecoveringPassword
            ? "Recuperar Contraseña"
            : "Iniciar Sesión"
          : "Registrarse"}
      </h1>
      {!isRecoveringPassword ? (
        <form style={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Nombre"
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Correo Electrónico"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={styles.passwordContainer}>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Contraseña"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              style={styles.togglePassword}
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          {!isLogin && (
            <div style={styles.passwordContainer}>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirmar Contraseña"
                style={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                style={styles.togglePassword}
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                {confirmPasswordVisible ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
          )}
          <button type="submit" style={styles.button}>
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>
      ) : (
        <div style={styles.form}>
          <input
            type="email"
            placeholder="Correo Electrónico"
            style={styles.input}
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
          />
          <button
            type="button"
            style={styles.button}
            onClick={handleRecoverPassword}
          >
            Recuperar Contraseña
          </button>
        </div>
      )}
      {!isRecoveringPassword ? (
        <p
          style={{ ...styles.toggleAuth, cursor: "pointer" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "¿No tienes una cuenta? Regístrate"
            : "¿Ya tienes una cuenta? Inicia sesión"}
        </p>
      ) : (
        <p
          style={{ ...styles.recover, cursor: "pointer" }}
          onClick={() => setIsRecoveringPassword(false)}
        >
          Volver
        </p>
      )}
      {!isRecoveringPassword && isLogin && (
        <p
          style={styles.recover}
          onClick={() => setIsRecoveringPassword(true)}
        >
          ¿Olvidaste tu contraseña?
        </p>
      )}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#F5F5F5",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000000",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    boxSizing: "border-box",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #BF9004",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
    backgroundColor: "#FFFFFF",
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "border-color 0.3s",
  },
  passwordContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  togglePassword: {
    position: "absolute",
    right: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    backgroundColor: "#FF9C00",
    color: "#FFFFFF",
    cursor: "pointer",
    width: "100%",
  },
  toggleAuth: {
    fontSize: "14px",
    color: "#FF9C00",
    textAlign: "center",
    cursor: "pointer",
    marginTop: "10px",
  },
  recover: {
    fontSize: "14px",
    textAlign: "center",
    marginTop: "10px",
    color: "#8F0001",
    textDecoration: "underline",
    cursor: "pointer",
  },
  error: {
    fontSize: "14px",
    color: "#FF0000",
    textAlign: "center",
    marginTop: "15px",
  },
};

export default AuthScreen;