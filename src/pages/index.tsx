import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>CS 312 Project Template</title>

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.page}`}>
        <main className={styles.main}>
          <h1>SNOWCIAL</h1>
        </main>
        <footer className={styles.footer}>COMING SOON</footer>
      </div>
    </>
  );
}
