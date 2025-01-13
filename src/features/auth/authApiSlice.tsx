import { apiSlice } from "../../app/api/ApiSlice";
import { logOut, setCredentials } from "./authSlice";

interface LoginResponse {
    accessToken: string;
}

interface RefreshResponse {
    accessToken: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, { username: string; password: string }>({
            query: (credentials) => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials },
            }),
        }),
        sendLogout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logOut({}));
                    dispatch(apiSlice.util.resetApiState());
                } catch (err) {
                    console.error("Error al cerrar sesión:", err);
                }
            },
        }),
        refresh: builder.mutation<RefreshResponse, void>({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { accessToken } = data;
                    dispatch(setCredentials({ accessToken }));
                } catch (err) {
                    console.error("Error al actualizar el token:", err);
                    dispatch(logOut({})); // Opcional: Forzar logout si falla
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice;

export { setCredentials };
