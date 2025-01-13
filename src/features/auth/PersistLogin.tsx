import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import PulseLoader from "react-spinners/PulseLoader";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type CustomError = FetchBaseQueryError & {
    data: {
        message: string;
    };
};

const PersistLogin = () => {
    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);

    const [trueSuccess, setTrueSuccess] = useState<boolean>(false);
    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    useEffect(() => {
        console.log("useEffect ran with:", { token, persist, isUninitialized, isLoading, isSuccess });

        const verifyRefreshToken = async () => {
            console.log("Intentando renovar token");
            try {
                const response = await refresh().unwrap();
                setTrueSuccess(true);
                console.log("Token renovado con éxito:", response);
            } catch (err) {
                console.error("Error al renovar token:", err);
            }
        };

        if (!token && persist) {
            verifyRefreshToken();
        } else {
            //console.log("No es necesario renovar el token:", { token, persist });
        }

        effectRan.current = true;
    }, [token, persist, refresh]);

    let content;
    if (!persist) {
        content = <Outlet />;
    } else if (isLoading) {
        content = <PulseLoader color={"#FFF"} />;
    } else if (isError) {
        content = (
            <p className="errmsg">
                {error && "data" in error
                    ? (error as CustomError).data.message
                    : "An error occurred"} - <Link to="/login">Por favor inicie sesión nuevamente</Link>.
            </p>
        );
    } else if (token || (isSuccess && trueSuccess)) {
        content = <Outlet />;
    }

    return content;

};

export default PersistLogin;
