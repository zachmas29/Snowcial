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
          <EventFeed />
        </main>
      </div>
    </>
  );
}
