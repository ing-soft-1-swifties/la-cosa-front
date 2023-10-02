import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { MaybePromise } from "@reduxjs/toolkit/dist/query/tsHelpers";
import { BaseQueryApi, BaseQueryFn, EndpointDefinitions, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const gameApi = createApi({
    // nombre de datos
    reducerPath: "gameListSlice",
    // url a la que le pediumos datos
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8000",
    }),
    //funciones que hacen peticion http
    // builder separar mutaciones de alteraciones
    endpoints: (builder) => ({
        getGames: builder.query<GetGamesQueryResult, undefined>({
            query: () => '/games',
        }),
        getInGame: builder.query<String, {name: string, room_id: number}>({
            query: ({name, room_id}) => ({
                url: "/join",
                method: "POST",
                body: {
                    "name": name,
                    "room_id": room_id
                }
            })

        })
    })
});

type GetGamesQueryResult = {
    'id': number,
    'name': string,
    'count': string,
    'max': number
}[]

// conseguir el hook de react con el nombre del endpoint
export const { useGetGamesQuery, useGetInGameQuery } = gameApi
