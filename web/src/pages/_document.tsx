import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  override render(): JSX.Element {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
