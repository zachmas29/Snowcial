import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Events() {
  return (
    <>
      <Head>
        <title>Events | Snowcial</title>
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>EVENTS</h1>
        </main>
      </div>
    </>
  );
}
