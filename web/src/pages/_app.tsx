import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

const App: React.VFC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Bigbrain</title>
        {/* https://zenn.dev/catnose99/articles/3d2f439e8ed161 */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>🧠</text></svg>"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
