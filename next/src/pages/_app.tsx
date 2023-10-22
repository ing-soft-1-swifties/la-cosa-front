import type { FC, ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { ChakraProvider, createStandaloneToast } from "@chakra-ui/react";
import Head from "next/head";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import SiteTheme from "@/src/theme";
import "@/src/styles/globals.css";
import GameAuthHandler from "@/components/GameAuthHandler";

type SiteAppProps = { // Propiedades de la aplicación
  children: ReactNode;
};

const { ToastContainer, toast } = createStandaloneToast(SiteTheme); 
export const StandaloneToast = toast; 

export const SiteApp: FC<SiteAppProps> = ({ children }) => { // Componente de la aplicación
  return (
    <>
      <Head>
        <title>La Cosa</title>
      </Head>
      <Provider store={store}>
        <ChakraProvider theme={SiteTheme}>
          {children}
          <ToastContainer />
        </ChakraProvider>
      </Provider>
    </>
  );
};

const wrapWithLayout = (Component: PageWithLayout, props: any) => { // Crea un layout para la página
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);
  return getLayout(<Component {...props} />);
};

type PageAuthConfig = { // Configuración de la página
  gameAuthProtected: boolean;
};

export type PageWithLayout<P = {}, IP = P> = NextPage<P, IP> & { // Página con layout
  getLayout?: (page: ReactElement) => ReactNode; // Obtiene el layout de la página
  authConfig?: PageAuthConfig; // Configuración de la página
};

type AppPropsWrapper = AppProps & { 
  Component: PageWithLayout;  
};

const DefaultPageAuthConfig: PageAuthConfig = {
  gameAuthProtected: false,
};

export default function MyApp({ Component, pageProps }: AppPropsWrapper) { 
  let Page = wrapWithLayout(Component, pageProps); 
  const auth: PageAuthConfig = Component.authConfig ?? DefaultPageAuthConfig; 
  Page = auth.gameAuthProtected ? (
    <GameAuthHandler>{Page}</GameAuthHandler>
  ) : (
    Page
  );
  return <SiteApp>{Page}</SiteApp>;
}
