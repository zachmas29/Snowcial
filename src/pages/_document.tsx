import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import type { DocumentHeadTagsProps } from "@mui/material-nextjs/v15-pagesRouter";
import {
  DocumentHeadTags,
  documentGetInitialProps,
} from "@mui/material-nextjs/v15-pagesRouter";
import {
  type DocumentContext,
  type DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

export default function Document(props: DocumentProps & DocumentHeadTagsProps) {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="dark light" />

        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Snowcial" />
        <link rel="manifest" href="/site.webmanifest" />

        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <InitColorSchemeScript attribute="data-mui-color-scheme" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};
