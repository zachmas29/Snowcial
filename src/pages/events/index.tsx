import { Typography } from "@mui/material";
import Head from "next/head";
import EventFeed from "@/components/EventFeed";
import PageLayout from "@/components/PageLayout";

export default function Events() {
  return (
    <>
      <Head>
        <title>Events | Snowcial</title>
      </Head>
      <PageLayout>
        <Typography
          variant="h3"
          component="h1"
          fontWeight={600}
          textAlign="center"
          mb={1}
        >
          Events
        </Typography>
        <EventFeed />
      </PageLayout>
    </>
  );
}
