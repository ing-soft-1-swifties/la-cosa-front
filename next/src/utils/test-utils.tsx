import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { PreloadedState } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { setupStore, AppStore, RootState } from "@/store/store";
import { ChakraProvider } from "@chakra-ui/react";
import SiteTheme from "@/src/theme";

// Documentacion: https://redux.js.org/usage/writing-tests

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

// Funcion que renderiza componentes con proveedores datos.
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  // Renderizamos con el un proveedor de Redux y otro de Chakra
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        <ChakraProvider theme={SiteTheme}>{children}</ChakraProvider>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
