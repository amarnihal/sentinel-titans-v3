import Document, { Html, Head, Main, NextScript } from "next/document";
import React from "react";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Saira:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          {/* Ensure page remains visible even if client JS errors occur.
              This overrides Next's FOUC hide style so users without JS or with runtime errors still see content. */}
          <style>{`body{display:block !important}`}</style>
          {/* Inline critical heading rule to ensure headings use Saira while fonts load */}
          <style>{`h1,h2,h3,h4,h5,h6{font-family:'Saira', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important; font-weight:600 !important; text-transform:uppercase !important;}`}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

