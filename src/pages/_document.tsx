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
