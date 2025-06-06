import { useRef, useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const Login = () => {
  useTitle("Inicio de sesión de empleados");

  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  interface ErrorResponse {
    status?: number;
    data?: {
      message?: string;
    };
  }

  const handleErrors = (err: ErrorResponse) => {
    if (!err.status) {
      setErrMsg("No hay respuesta del servidor");
    } else if (err.status === 400) {
      setErrMsg("Falta usuario o contraseña");
    } else if (err.status === 401) {
      setErrMsg("No autorizado");
    } else {
      setErrMsg(err.data?.message || "Error desconocido");
    }
    errRef.current?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (err) {
      handleErrors(err as ErrorResponse);
    }
  };

  const handleUserInput = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);

  const handlePwdInput = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <PulseLoader color={"#FFF"} />;

  return (
    <section className="public">
      <header>
        <h1>Inicio de sesión de empleados</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Usuario:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="username"
            required
          />

          <label htmlFor="password">Contraseña:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
            autoComplete="current-password"
          />
          <button className="form__submit-button">Iniciar Sesión</button>

          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Dispositivo confiable
          </label>
        </form>
      </main>
      <footer>
        <Link to="/" className="btn btn-primary">Página de inicio</Link>
      </footer>
    </section>
  );
};

export default Login;
