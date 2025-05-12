import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authApiSlice";
import { logOut } from "../../features/auth/authSlice";

// 1. Definición de tipos mejorada
interface RootState {
  auth: {
    token: string;
  };
}

interface RefreshResponse {
  accessToken: string;
  // Otros campos que devuelva tu endpoint /auth/refresh
}

// 2. Base query con tipos explícitos
const baseQuery = fetchBaseQuery({
  baseUrl: "hhttps://servidor-7zli.onrender.com",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// 3. Base query con reautenticación - versión tipada correctamente
const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  let result = await baseQuery(args, api, extraOptions);

  // Verificación de error de autenticación
  if (result?.error?.status === 401 || result?.error?.status === 403) {
    console.log("Token expirado, intentando refrescar...");
    
    // Intento de refrescar el token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    
    if (refreshResult?.data) {
      // Almacena el nuevo token
      const refreshData = refreshResult.data as RefreshResponse;
      api.dispatch(setCredentials({ accessToken: refreshData.accessToken }));
      
      // Reintenta la consulta original con el nuevo token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Fallo al refrescar - logout
      api.dispatch(logOut(undefined)); // Pasar undefined como payload
      window.location.href = '/login';
      return refreshResult;
    }
  }

  return result;
};

// 4. Creación del API slice
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Note', 'User'],
  endpoints: () => ({}), // Endpoints vacíos que se inyectarán en otros slices
});