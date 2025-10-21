import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function People() {
  return (
    <>
      <Head>
        <title>People | Snowcial</title>
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>PEOPLE</h1>
        </main>
      </div>
    </>
  );
}
