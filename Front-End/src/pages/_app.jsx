//theme
import "primereact/resources/themes/lara-dark-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

import "@/styles/globals.css";
import MenuBar from "@/components/MenuBar";
import { ServiciosContextProvider } from "@/context/ServiciosContext";
import { useEffect } from "react";
import { verifyUser } from "@/scripts/auths";
import Router from "next/router";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    (async () => {
      const user = await verifyUser();

      if (!user) Router.replace("/");
    })();
  }, []);

  return (
    <>
      <MenuBar />
      <ServiciosContextProvider>
        <main className="w-11/12 mx-auto">
          <Component {...pageProps} />
        </main>
      </ServiciosContextProvider>
    </>
  );
}
