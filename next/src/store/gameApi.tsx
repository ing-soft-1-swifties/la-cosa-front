import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { MaybePromise } from "@reduxjs/toolkit/dist/query/tsHelpers";
import { BaseQueryApi, BaseQueryFn, EndpointDefinitions, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const gameApi = createApi({
    // nombre de datos
    reducerPath: "gameApi",
    // url a la que le pediumos datos
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8000",
    }),
    //funciones que hacen peticion http
    // builder separar mutaciones de alteraciones
    endpoints: (builder) => ({
        getGames: builder.query<GetGamesQueryResult, undefined>({ 
            query: () => '/list',
        }),
        // al final el join lo hacemos con un simple fetch
        // TO DROP
        //joinGame: builder.query<string, {name: string, room_id: number}>({
        //    query: ({name, room_id}) => ({
        //        url: "/join",
        //        method: "POST",
        //        body: {
        //            "name": name,
        //            "room_id": room_id
        //        }
        //    })
        //
        //})
    })
});

export type GetGamesQueryResult = { // Resultado de la query de obtener partidas
    'id': number,
    'name': string,
    'players_count': number,
    'max_players': number
}[]

// conseguir el hook de react con el nombre del endpoint
export const { useGetGamesQuery } = gameApi
