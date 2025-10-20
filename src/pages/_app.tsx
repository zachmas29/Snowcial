import "@/styles/globals.css";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import type { AppProps } from "next/app";
import { NavBar } from "@/components/NavBar";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppCacheProvider {...pageProps}>
      <>
        <Component {...pageProps} />
        <NavBar />
      </>
    </AppCacheProvider>
  );
}
