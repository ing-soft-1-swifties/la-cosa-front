import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { MaybePromise } from "@reduxjs/toolkit/dist/query/tsHelpers";
import { BaseQueryApi, BaseQueryFn, EndpointDefinitions, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const gameListSlice = createApi({
    // nombre de datos
    reducerPath: "gameListSlice",
    // url a la que le pediumos datos
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3003",
    }),
    //funciones que hacen peticion http
    // builder separar mutaciones de alteraciones
    endpoints: (builder) => ({
        getGames: builder.query({
            query: () => '/games',
        })
    })
});

// conseguir el hook de react con el nombre del endpoint
export const { useGetGamesQuery } = gameListSlice