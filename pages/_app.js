import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/layout/layout";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer />
    </SessionProvider>
  );
}

export default MyApp;
