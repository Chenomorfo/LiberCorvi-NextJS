//theme
import "primereact/resources/themes/lara-dark-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

import "@/styles/globals.css";
import MenuBar from "@/components/MenuBar";

export default function App({ Component, pageProps }) {
  return (
    <>
      <MenuBar />
      <main className="w-11/12 mx-auto">
        <Component {...pageProps} />
      </main>
    </>
  );
}
