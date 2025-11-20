import { Typography } from "@mui/material";
import Head from "next/head";
import EventFeed from "@/components/EventFeed";
import styles from "@/styles/Home.module.css";

export default function Events() {
  return (
    <>
      <Head>
        <title>Events | Snowcial</title>
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
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
        </main>
      </div>
    </>
  );
}
