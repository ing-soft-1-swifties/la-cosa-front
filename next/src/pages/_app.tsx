import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import SiteTheme from "@/src/theme";
import "@/src/styles/globals.css";


export type PageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWrapper = AppProps & {
  Component: PageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWrapper) {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);
  let Page = getLayout(<Component {...pageProps} />);

  return (
    <>
      <Head>
        <title>La Cosa</title>
      </Head>
      <Provider store={store}>
        <ChakraProvider theme={SiteTheme}>
            {Page}
        </ChakraProvider>
      </Provider>
    </>
  );
}