import Navbar from "../components/navbar";
import "../styles/global.css";
import { SessionProvider } from "next-auth/react";
import { LoadingProvider } from "../contexts/loadingContext";

function App({ Component, pageProps }) {
  return (
    <LoadingProvider>
      <SessionProvider session={pageProps.session}>
        <Navbar />
        <Component {...pageProps} />
      </SessionProvider>
    </LoadingProvider>
  );
}

export default App;
