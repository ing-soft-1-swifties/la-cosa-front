import {
  PreloadedState,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query/react";
import gameReducer from "@/store/gameSlice";
import userReducer from "@/store/userSlice";

// Creamos el reducer root para extraer el tipo de RootState
const rootReducer = combineReducers({
  user: userReducer,
  game: gameReducer,
});

// Usado para poder crear stores para los tests.
export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    devTools: process.env.NODE_ENV !== "production",
    reducer: rootReducer,
    preloadedState,
  });
};

// Store de la App
export const store = setupStore();
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
